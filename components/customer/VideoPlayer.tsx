"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import type HlsType from "hls.js";

type Candidate = {
  ratio: number;
  priority: number;
  setActive: (active: boolean) => void;
};

// Global coordinator to ensure all visible cards play seamlessly
const candidates = new Map<symbol, Candidate>();
const activePlayers = new Set<symbol>();
const MAX_CONCURRENT_VIDEOS = 8; // High concurrency so every dish in view plays its video

function coordinateActivePlayers() {
  queueMicrotask(() => {
    const eligible = [...candidates.entries()]
      .filter(([, candidate]) => candidate.ratio > 0)
      .sort(
        ([, left], [, right]) =>
          right.priority - left.priority || right.ratio - left.ratio,
      )
      .slice(0, MAX_CONCURRENT_VIDEOS)
      .map(([id]) => id);

    const nextActiveSet = new Set(eligible);

    candidates.forEach((candidate, id) => {
      const shouldBeActive = nextActiveSet.has(id);
      candidate.setActive(shouldBeActive);
    });

    activePlayers.clear();
    eligible.forEach((id) => activePlayers.add(id));
  });
}

type VideoPlayerProps = {
  videoUrl: string;
  fallbackVideoUrl?: string;
  posterUrl?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  playbackPriority?: boolean;
  hovered?: boolean;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  className?: string;
};

function VideoPlayer({
  videoUrl,
  fallbackVideoUrl,
  posterUrl,
  title,
  autoPlay = true,
  muted = true,
  controls = false,
  loop = true,
  playbackPriority = false,
  hovered,
  objectPosition = "center center",
  objectFit = "cover",
  className = "",
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const idRef = useRef(Symbol("customer-video"));
  const hlsRef = useRef<HlsType | null>(null);
  const activeRef = useRef(false);

  const [isActive, setIsActive] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasFallbackActive, setHasFallbackActive] = useState(false);
  const [hasError, setHasError] = useState(false);

  const currentSource = hasFallbackActive && fallbackVideoUrl ? fallbackVideoUrl : videoUrl;
  const isHoverControlled = hovered !== undefined;

  // Reduced motion preference
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", onMotionChange);
    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  // Fine pointer detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHasFinePointer(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  // Mobile layout detection for browser emulation and tablets that report a mouse.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsNarrowViewport(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const setPlayerActive = useCallback((active: boolean) => {
    activeRef.current = active;
    if (!active) {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      setIsVideoLoaded(false);
    }
    setIsActive((current) => (current === active ? current : active));
  }, []);

  // Player coordination: previews only run for deliberate hover on fine pointers.
  useEffect(() => {
    const shouldPlayOnHover =
      isHoverControlled && hasFinePointer && !isNarrowViewport && hovered;
    const shouldPlayImmediately = !isHoverControlled && autoPlay;
    const eligibleRatio = prefersReducedMotion
      ? 0
      : shouldPlayOnHover || shouldPlayImmediately
        ? 1
        : 0;

    const playerId = idRef.current;
    candidates.set(playerId, {
      ratio: eligibleRatio,
      priority: shouldPlayOnHover || shouldPlayImmediately ? (playbackPriority ? 2.5 : 2) : 0,
      setActive: setPlayerActive,
    });
    coordinateActivePlayers();

    return () => {
      candidates.delete(playerId);
      coordinateActivePlayers();
    };
  }, [autoPlay, hasFinePointer, hovered, isHoverControlled, isNarrowViewport, playbackPriority, prefersReducedMotion, setPlayerActive]);

  const destroyHls = useCallback(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video || !activeRef.current || !autoPlay || prefersReducedMotion) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsVideoLoaded(true))
        .catch(() => undefined);
    }
  }, [autoPlay, prefersReducedMotion]);

  const handleError = useCallback(() => {
    if (fallbackVideoUrl && !hasFallbackActive) {
      setHasFallbackActive(true);
    } else {
      setHasError(true);
    }
  }, [fallbackVideoUrl, hasFallbackActive]);

  const loadVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !activeRef.current || !currentSource || prefersReducedMotion) return;

    if (video.getAttribute("src") === currentSource || hlsRef.current) {
      play();
      return;
    }

    const isHls = /\.m3u8|\/hls\/|format=m3u8/i.test(currentSource);
    try {
      if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = currentSource;
        play();
        return;
      }

      if (isHls) {
        const Hls = (await import("hls.js")).default;
        if (!activeRef.current || !Hls.isSupported()) return;
        const hls = new Hls({ enableWorker: true, maxBufferLength: 30 });
        hlsRef.current = hls;
        hls.loadSource(currentSource);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, play);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;
          destroyHls();
          handleError();
        });
        return;
      }

      video.src = currentSource;
      play();
    } catch {
      handleError();
    }
  }, [currentSource, destroyHls, handleError, play, prefersReducedMotion]);

  useEffect(() => {
    if (!isActive || hasError || prefersReducedMotion) {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      hlsRef.current?.stopLoad();
      return;
    }
    hlsRef.current?.startLoad();
    const frame = window.requestAnimationFrame(() => void loadVideo());
    return () => window.cancelAnimationFrame(frame);
  }, [hasError, isActive, loadVideo, prefersReducedMotion]);

  useEffect(
    () => () => {
      candidates.delete(idRef.current);
      coordinateActivePlayers();
      destroyHls();
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    },
    [destroyHls],
  );

  if (hasError || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`h-full w-full overflow-hidden ${className}`}
    >
      <video
        ref={videoRef}
        poster={posterUrl}
        autoPlay={autoPlay && isActive}
        muted={muted}
        loop={loop}
        playsInline
        controls={controls}
        preload="metadata"
        aria-hidden={isHoverControlled ? true : undefined}
        aria-label={
          isHoverControlled
            ? undefined
            : title
              ? `${title} cinematic video preview`
              : "Dish video preview"
        }
        style={{
          objectPosition,
          objectFit,
        }}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ease-out ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        onCanPlay={play}
        onLoadedData={() => setIsVideoLoaded(true)}
        onError={handleError}
      />
    </div>
  );
}

export default memo(VideoPlayer);
