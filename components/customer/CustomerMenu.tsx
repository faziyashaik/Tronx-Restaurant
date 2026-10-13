"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dish, RestaurantMenu } from "@/types";
import type { TableStatus } from "@/types";
import CategoryNav from "@/components/customer/CategoryNav";
import PremiumMenuCarousel from "@/components/customer/PremiumMenuCarousel";
import RestaurantHero from "@/components/customer/RestaurantHero";
import TronxNavbar from "@/components/customer/TronxNavbar";
import TronxAboutSection from "@/components/customer/TronxAboutSection";
import TronxFooter from "@/components/customer/TronxFooter";
import DishDetailModal from "@/components/customer/DishDetailModal";
import AskTronxConcierge from "@/components/customer/AskTronxConcierge";
import { api } from "@/lib/api";
import {
  Minus,
  Plus,
  ShoppingBag,
  X,
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";
import type { OrderSummary } from "@/types";
import ReservationPanel from "@/components/customer/ReservationPanel";
import WifiAccessPanel from "@/components/customer/WifiAccessPanel";

type CartSelection = { groupId: string; addonIds: string[] };
type CartLine = { key: string; dishId: string; quantity: number; selections: CartSelection[] };
type CustomerOrderReceipt = Pick<OrderSummary, "id" | "orderNumber" | "tableNumber" | "total" | "status"> &
  Partial<Pick<OrderSummary, "items" | "subtotal" | "createdAt" | "updatedAt">> & {
    token: string;
    restaurantId?: string;
    restaurantSlug?: string;
    tableId?: string;
    customerSessionId?: string;
  };

type DietaryChip =
  | "ALL"
  | "SIGNATURE"
  | "CHEFS CHOICE"
  | "VEGETARIAN"
  | "VEGAN"
  | "GLUTEN FREE"
  | "NUT FREE"
  | "HALAL";

const DIETARY_CHIPS: DietaryChip[] = [
  "SIGNATURE",
  "CHEFS CHOICE",
  "VEGETARIAN",
  "VEGAN",
  "GLUTEN FREE",
  "NUT FREE",
  "HALAL",
];

const orderStatusMessage: Record<OrderSummary["status"], string> = {
  PENDING: "Order received — waiting for restaurant confirmation",
  ACCEPTED: "The restaurant accepted your order",
  PREPARING: "Your food is being prepared",
  READY: "Your order is ready",
  SERVED: "Order completed",
  CANCELLED: "This order was cancelled. Please speak with restaurant staff.",
};

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.key === "string" &&
    typeof line.dishId === "string" &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0 &&
    Array.isArray(line.selections) &&
    line.selections.every(
      (selection) =>
        Boolean(
          selection &&
            typeof selection.groupId === "string" &&
            Array.isArray(selection.addonIds) &&
            selection.addonIds.every((id) => typeof id === "string"),
        ),
    )
  );
}

function isCustomerOrderReceipt(value: unknown): value is CustomerOrderReceipt {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Partial<CustomerOrderReceipt>;
  return (
    typeof receipt.id === "string" &&
    typeof receipt.token === "string" &&
    typeof receipt.orderNumber === "number" &&
    typeof receipt.tableNumber === "number" &&
    typeof receipt.total === "number" &&
    Boolean(receipt.status && receipt.status in orderStatusMessage)
  );
}

function parseCustomerOrderReceipts(value: unknown): CustomerOrderReceipt[] {
  const candidates = Array.isArray(value) ? value : value ? [value] : [];
  return candidates.filter(isCustomerOrderReceipt);
}

function readStoredCustomerOrders(value: string | null): CustomerOrderReceipt[] {
  if (!value) return [];
  try {
    return parseCustomerOrderReceipts(JSON.parse(value));
  } catch {
    return [];
  }
}

type CustomerMenuProps = {
  initialMenu: RestaurantMenu;
  restaurantIdOrSlug: string;
  tableNumber: number | null;
  tableId: string | null;
  tableStatus: TableStatus | null;
  invalidTable: boolean;
  reservationsEnabled?: boolean;
  initialReservationView?: boolean;
  wifiEnabled?: boolean;
  videoMenuEnabled?: boolean;
  tableOrderingEnabled?: boolean;
};

export default function CustomerMenu({
  initialMenu,
  restaurantIdOrSlug,
  tableNumber,
  tableId,
  tableStatus,
  invalidTable,
  reservationsEnabled = false,
  initialReservationView = false,
  wifiEnabled = false,
  videoMenuEnabled = true,
  tableOrderingEnabled = true,
}: CustomerMenuProps) {
  const [reservationOpen, setReservationOpen] = useState(initialReservationView);
  const [wifiOpen, setWifiOpen] = useState(false);
  const [refreshResult, setRefreshResult] = useState<{
    restaurantIdOrSlug: string;
    menu: RestaurantMenu;
  } | null>(null);

  const menu =
    refreshResult?.restaurantIdOrSlug === restaurantIdOrSlug
      ? refreshResult.menu
      : initialMenu;

  const activeCategories = useMemo(
    () =>
      menu.categories
        .filter((category) => category.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [menu.categories],
  );

  const [activeCategory, setActiveCategory] = useState(
    () => activeCategories[0]?.id ?? "",
  );

  // Search and Dietary Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<DietaryChip | "ALL">("ALL");

  // Client-side Wishlist / Favorites
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem(`tronx-favorites:${menu.restaurant.id}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleFavorite = useCallback(
    (dishId: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(dishId)) next.delete(dishId);
        else next.add(dishId);
        try {
          localStorage.setItem(
            `tronx-favorites:${menu.restaurant.id}`,
            JSON.stringify([...next]),
          );
        } catch {
          // Ignore
        }
        return next;
      });
    },
    [menu.restaurant.id],
  );

  // Filter dishes based on search query & dietary chip selection
  const filteredDishes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return menu.dishes.filter((dish) => {
      // Search matching
      const matchesQuery =
        !query ||
        [dish.name, dish.description]
          .filter((val): val is string => Boolean(val))
          .some((val) => val.toLowerCase().includes(query)) ||
        dish.dietaryTags?.some((tag) => tag.toLowerCase().includes(query));

      if (!matchesQuery) return false;

      // Dietary chip matching
      if (selectedDietary === "SIGNATURE") {
        return dish.isSignature || dish.sortOrder === 1;
      }
      if (selectedDietary === "CHEFS CHOICE") {
        return dish.isChefsChoice || dish.name.toLowerCase().includes("royal");
      }
      if (selectedDietary === "VEGETARIAN") {
        return dish.isVeg;
      }
      if (selectedDietary === "VEGAN") {
        return dish.dietaryTags?.includes("VEGAN");
      }
      if (selectedDietary === "GLUTEN FREE") {
        return dish.dietaryTags?.includes("GLUTEN FREE");
      }
      if (selectedDietary === "NUT FREE") {
        return dish.dietaryTags?.includes("NUT FREE");
      }
      if (selectedDietary === "HALAL") {
        return dish.dietaryTags?.includes("HALAL");
      }

      return true;
    });
  }, [menu.dishes, searchQuery, selectedDietary]);

  // Dynamic counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const category of activeCategories) {
      counts[category.id] = filteredDishes.filter(
        (d) => d.categoryId === category.id,
      ).length;
    }
    return counts;
  }, [activeCategories, filteredDishes]);

  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const selectedDish =
    menu.dishes.find((dish) => dish.id === selectedDishId) ?? null;

  const isManualScrolling = useRef(false);
  const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const submitInFlight = useRef(false);
  const idempotencyRef = useRef<string | null>(null);

  const cartKey = `tronx-cart:${menu.restaurant.id}:${tableId ?? "no-table"}`;
  const orderKey = `${cartKey}:orders`;
  const legacyOrderKey = `${cartKey}:active-order`;
  const canOrder = Boolean(
    tableOrderingEnabled && tableNumber && !invalidTable && tableStatus !== "CLOSED",
  );
  const tableResolved = Boolean(tableNumber && tableId && !invalidTable);

  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [loadedCartKey, setLoadedCartKey] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [customerOrders, setCustomerOrders] = useState<CustomerOrderReceipt[]>([]);
  const [unpollableOrderIds, setUnpollableOrderIds] = useState<string[]>([]);
  const [customerSessionId, setCustomerSessionId] = useState<string | null>(null);

  useEffect(() => {
    const hydrate = () => {
      let currentSessionId = crypto.randomUUID();
      try {
        const savedCart = localStorage.getItem(cartKey);
        const parsedCart: unknown = savedCart ? JSON.parse(savedCart) : [];
        setCart(Array.isArray(parsedCart) ? parsedCart.filter(isCartLine) : []);

        const savedOrder = localStorage.getItem(orderKey);
        const savedLegacyOrder = localStorage.getItem(legacyOrderKey);
        const allSavedOrders = [
          ...readStoredCustomerOrders(savedOrder),
          ...readStoredCustomerOrders(savedLegacyOrder),
        ];
        const parsedOrders = [
          ...new Map(allSavedOrders.map((order) => [order.id, order])).values(),
        ];

        const customerSessionStorageKey = `${cartKey}:customer-session`;
        try {
          currentSessionId =
            sessionStorage.getItem(customerSessionStorageKey) ?? currentSessionId;
          sessionStorage.setItem(customerSessionStorageKey, currentSessionId);
        } catch {
          // sessionStorage fallback
        }
        setCustomerSessionId(currentSessionId);

        const storedOrders = parsedOrders.map((order) => ({
          ...order,
          restaurantId: order.restaurantId ?? menu.restaurant.id,
          restaurantSlug: order.restaurantSlug ?? menu.restaurant.slug,
          tableId: order.tableId ?? tableId ?? undefined,
          customerSessionId: order.customerSessionId ?? currentSessionId,
        }));

        if (savedOrder || savedLegacyOrder) {
          localStorage.setItem(orderKey, JSON.stringify(storedOrders));
          localStorage.removeItem(legacyOrderKey);
        }

        setCustomerOrders(
          storedOrders.filter(
            (order) => order.customerSessionId === currentSessionId,
          ),
        );
        setUnpollableOrderIds([]);
        const savedKey = sessionStorage.getItem(`${cartKey}:submit-key`);
        idempotencyRef.current = savedKey;
        setLoadedCartKey(cartKey);
        setCartOpen(false);
      } catch {
        setCart([]);
        setCustomerOrders([]);
        setUnpollableOrderIds([]);
        setCustomerSessionId(currentSessionId);
        idempotencyRef.current = null;
        setLoadedCartKey(cartKey);
        setCartOpen(false);
      } finally {
        setCartReady(true);
      }
    };
    window.setTimeout(hydrate, 0);
  }, [
    cartKey,
    legacyOrderKey,
    menu.restaurant.id,
    menu.restaurant.slug,
    orderKey,
    tableId,
  ]);

  useEffect(() => {
    if (loadedCartKey !== cartKey || !customerSessionId) return;
    try {
      const existingOrders = parseCustomerOrderReceipts(
        JSON.parse(localStorage.getItem(orderKey) ?? "null"),
      );
      const mergedOrders = [
        ...existingOrders.filter(
          (order) => order.customerSessionId !== customerSessionId,
        ),
        ...customerOrders,
      ];
      if (mergedOrders.length)
        localStorage.setItem(orderKey, JSON.stringify(mergedOrders));
      else localStorage.removeItem(orderKey);
    } catch {
      // Keep customer order history in state
    }
  }, [cartKey, customerOrders, customerSessionId, loadedCartKey, orderKey]);

  useEffect(() => {
    const syncOrders = (event: StorageEvent) => {
      if (event.key !== orderKey) return;
      try {
        const orders = parseCustomerOrderReceipts(
          event.newValue ? JSON.parse(event.newValue) : null,
        );
        const currentSessionOrders = orders.filter(
          (order) => order.customerSessionId === customerSessionId,
        );
        setCustomerOrders((current) =>
          JSON.stringify(current) === JSON.stringify(currentSessionOrders)
            ? current
            : currentSessionOrders,
        );
        setUnpollableOrderIds([]);
      } catch {
        setCustomerOrders([]);
      }
    };
    window.addEventListener("storage", syncOrders);
    return () => window.removeEventListener("storage", syncOrders);
  }, [customerSessionId, orderKey]);

  useEffect(() => {
    if (!cartReady || loadedCartKey !== cartKey) return;
    try {
      if (cart.length) localStorage.setItem(cartKey, JSON.stringify(cart));
      else localStorage.removeItem(cartKey);
    } catch {
      // Usable without storage
    }
  }, [cart, cartKey, cartReady, loadedCartKey]);

  const priceForLine = (line: CartLine) => {
    const dish = menu.dishes.find((entry) => entry.id === line.dishId);
    if (!dish) return 0;
    const addonTotal = line.selections
      .flatMap((selection) => {
        const group = dish.addonGroups?.find(
          (entry) => entry.id === selection.groupId,
        );
        return selection.addonIds.map(
          (addonId) =>
            group?.addons.find((addon) => addon.id === addonId)?.price ?? 0,
        );
      })
      .reduce((sum, price) => sum + price, 0);
    return (dish.price + addonTotal) * line.quantity;
  };

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cart.reduce((sum, line) => sum + priceForLine(line), 0);
  const customerOrdersTotal = customerOrders.reduce(
    (sum, order) => sum + order.total,
    0,
  );

  const addToCart = (entry: {
    dishId: string;
    quantity: number;
    selections: CartSelection[];
  }) => {
    const canonicalSelections = [...entry.selections]
      .map((selection) => ({
        ...selection,
        addonIds: [...selection.addonIds].sort(),
      }))
      .sort((a, b) => a.groupId.localeCompare(b.groupId));
    const key = `${entry.dishId}:${JSON.stringify(canonicalSelections)}`;

    setCart((current) => {
      const existing = current.find((line) => line.key === key);
      return existing
        ? current.map((line) =>
            line.key === key
              ? { ...line, quantity: Math.min(99, line.quantity + entry.quantity) }
              : line,
          )
        : [
            ...current,
            {
              key,
              dishId: entry.dishId,
              quantity: entry.quantity,
              selections: canonicalSelections,
            },
          ];
    });
    setOrderError("");
  };

  // Quick Add: single tap adds immediately if no required options; opens modal if options needed
  const handleQuickAdd = (dish: Dish) => {
    const hasRequiredOptions = (dish.addonGroups ?? []).some(
      (g) => g.isActive !== false && g.isRequired && g.addons.length > 0,
    );

    if (hasRequiredOptions) {
      setSelectedDishId(dish.id);
    } else {
      addToCart({
        dishId: dish.id,
        quantity: 1,
        selections: [],
      });
    }
  };

  const changeQuantity = (key: string, delta: number) =>
    setCart((current) =>
      current
        .map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + delta } : line,
        )
        .filter((line) => line.quantity > 0 && line.quantity <= 99),
    );

  const placeOrder = async () => {
    if (
      !canOrder ||
      !customerSessionId ||
      !cart.length ||
      submitting ||
      submitInFlight.current
    )
      return;
    submitInFlight.current = true;
    setSubmitting(true);
    setOrderError("");
    try {
      const key = idempotencyRef.current ?? crypto.randomUUID();
      idempotencyRef.current = key;
      try {
        sessionStorage.setItem(`${cartKey}:submit-key`, key);
      } catch {
        // Keep in memory
      }
      const response = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: menu.restaurant.slug,
          tableNumber,
          idempotencyKey: key,
          items: cart.map((line) => {
            const dish = menu.dishes.find((entry) => entry.id === line.dishId)!;
            return {
              dishId: dish.id,
              quantity: line.quantity,
              expectedUnitPrice: dish.price,
              selections: line.selections.map((selection) => ({
                groupId: selection.groupId,
                addons: selection.addonIds.map((addonId) => ({
                  addonId,
                  expectedUnitPrice:
                    dish.addonGroups
                      ?.find((group) => group.id === selection.groupId)
                      ?.addons.find((addon) => addon.id === addonId)?.price ?? -1,
                })),
              })),
            };
          }),
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
        data?: { order: OrderSummary; customerToken: string };
      };

      if (!response.ok || !result.success || !result.data)
        throw new Error(result.error || "Unable to place your order.");

      const receipt: CustomerOrderReceipt = {
        ...result.data.order,
        token: result.data.customerToken,
        restaurantId: menu.restaurant.id,
        restaurantSlug: menu.restaurant.slug,
        tableId: tableId ?? undefined,
        customerSessionId,
      };

      try {
        sessionStorage.removeItem(`${cartKey}:submit-key`);
      } catch {
        // Ignore
      }
      idempotencyRef.current = null;
      setCustomerOrders((current) => [
        ...current.filter((order) => order.id !== receipt.id),
        receipt,
      ]);
      setCart([]);
      setCartOpen(false);
    } catch (error) {
      setOrderError(
        error instanceof Error ? error.message : "Unable to place your order.",
      );
    } finally {
      submitInFlight.current = false;
      setSubmitting(false);
    }
  };

  const pollableOrders = useMemo(
    () =>
      customerOrders.filter(
        (order) =>
          order.status !== "SERVED" &&
          order.status !== "CANCELLED" &&
          !unpollableOrderIds.includes(order.id),
      ),
    [customerOrders, unpollableOrderIds],
  );

  useEffect(() => {
    if (!pollableOrders.length || loadedCartKey !== cartKey) return;
    let alive = true;
    const refreshStatus = async () => {
      const results = await Promise.all(
        pollableOrders.map(async (order) => {
          try {
            const response = await fetch(
              `/api/orders/${encodeURIComponent(order.id)}/status`,
              {
                cache: "no-store",
                headers: { Authorization: `Bearer ${order.token}` },
              },
            );
            if (
              response.status === 401 ||
              response.status === 403 ||
              response.status === 404
            )
              return { id: order.id, rejected: true as const };
            const result = (await response.json()) as {
              success: boolean;
              data?: OrderSummary;
            };
            return result.success && result.data
              ? { id: order.id, rejected: false as const, order: result.data }
              : null;
          } catch {
            return null;
          }
        }),
      );
      if (!alive) return;
      const updates = results.filter(
        (result): result is NonNullable<typeof result> => result !== null,
      );
      const rejectedIds = updates
        .filter((result) => result.rejected)
        .map((result) => result.id);
      if (rejectedIds.length)
        setUnpollableOrderIds((current) => [
          ...new Set([...current, ...rejectedIds]),
        ]);
      const validUpdates = updates.filter(
        (result): result is Extract<typeof result, { rejected: false }> =>
          !result.rejected,
      );
      if (validUpdates.length) {
        setCustomerOrders((current) => {
          let changed = false;
          const next = current.map((order) => {
            const result = validUpdates.find(
              (entry) => entry.id === order.id,
            )?.order;
            if (
              !result ||
              (order.status === result.status &&
                order.updatedAt === result.updatedAt)
            )
              return order;
            changed = true;
            return { ...order, ...result, token: order.token };
          });
          return changed ? next : current;
        });
      }
    };
    void refreshStatus();
    const timer = window.setInterval(() => void refreshStatus(), 8000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [cartKey, loadedCartKey, pollableOrders]);

  const refreshMenu = useCallback(async () => {
    try {
      const next = await api.getPublicMenu(restaurantIdOrSlug);
      setRefreshResult({ restaurantIdOrSlug, menu: next });
    } catch {
      return;
    }
  }, [restaurantIdOrSlug]);

  useEffect(() => {
    const onFocus = () => {
      void refreshMenu();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshMenu]);

  const handleCategorySelect = (categoryId: string) => {
    isManualScrolling.current = true;
    setActiveCategory(categoryId === "all" ? "" : categoryId);

    if (manualScrollTimeout.current) {
      clearTimeout(manualScrollTimeout.current);
    }

    manualScrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 750);
  };

  useEffect(() => {
    return () => {
      if (manualScrollTimeout.current) {
        clearTimeout(manualScrollTimeout.current);
      }
    };
  }, []);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDietary("ALL");
  };

  const isFiltered = searchQuery.trim() !== "" || selectedDietary !== "ALL";

  return (
    <main className="customer-menu min-h-screen bg-[#faf5ef] text-[#1e1415] selection:bg-[#dfb28e]/30">
      {/* 0. TRONX Global Burgundy Navbar */}
      <TronxNavbar
        restaurantName={menu.restaurant.name}
        tableNumber={tableNumber}
        reservationsEnabled={reservationsEnabled}
        wifiEnabled={wifiEnabled}
        tableOrderingEnabled={tableOrderingEnabled}
        cartCount={cartCount}
        onOpenReservation={() => setReservationOpen(true)}
        onOpenWifi={() => setWifiOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* 1. Cinematic Video Hero Section (Compact controlled height) */}
      <RestaurantHero
        restaurant={menu.restaurant}
        tableNumber={tableNumber}
      />
      {invalidTable && (
        <div role="alert" className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3.5 text-sm text-amber-900 shadow-xs">
            This table link is invalid or inactive. You can browse the menu, but ordering is disabled. Please ask your server for assistance.
          </p>
        </div>
      )}

      {tableResolved && tableStatus === "CLOSED" && (
        <div role="status" className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="rounded-2xl border border-rose-300 bg-rose-50 px-5 py-3.5 text-sm text-rose-900 shadow-xs">
            This table is currently unavailable. Please ask restaurant staff.
          </p>
        </div>
      )}

      {/* 3. Customer Active Orders Timeline */}
      {loadedCartKey === cartKey && customerOrders.length > 0 && (
        <section
          aria-live="polite"
          aria-label="Your live orders"
          className="mx-auto mt-4 max-h-[55vh] max-w-7xl space-y-2 overflow-y-auto px-4 pb-1 sm:px-6 lg:px-8"
        >
          <header className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-2xl border border-[#e6d8cb] bg-[#fffaf6]/95 p-3.5 shadow-xs backdrop-blur-md">
            <div>
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-[#541e24]">
                Your Live Orders
              </h2>
              {tableNumber && <p className="text-xs text-[#705e60]">Table {tableNumber}</p>}
            </div>
            <div className="text-right text-xs text-[#705e60]">
              <p>
                {customerOrders.length} {customerOrders.length === 1 ? "order" : "orders"}
              </p>
              <p className="font-mono font-bold text-[#541e24]">
                Total ₹{customerOrdersTotal}
              </p>
            </div>
          </header>
          {customerOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-[#e6d8cb] bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#d25b39]">
                    Order #{order.orderNumber}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#1e1415]">
                    {orderStatusMessage[order.status]}
                  </p>
                  {order.createdAt && (
                    <p className="mt-0.5 text-xs text-[#705e60]">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <span className="font-mono text-base font-extrabold text-[#541e24]">
                  ₹{order.total}
                </span>
              </div>
              {order.items && order.items.length > 0 && (
                <ul className="mt-2.5 space-y-1 border-t border-[#f5ebe1] pt-2">
                  {order.items.map((item, index) => (
                    <li key={`${item.dishId}-${index}`} className="text-xs sm:text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="font-medium text-[#1e1415]">
                          {item.quantity} × {item.dishNameSnapshot}
                        </span>
                        <span className="font-mono text-xs text-[#705e60]">
                          ₹{item.itemTotal}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>
      )}

      {/* 
        4. STICKY REFINED NAVIGATION TOOLBAR MATCHING USER REFERENCE SCREENSHOT:
        - Top Row: Left Search Input, Right Filter Funnel + Dietary Chips
        - Bottom Row: Category Pills: ALL (20), STARTERS (3), MAIN COURSE (3)...
      */}
      <div className="customer-menu-controls sticky top-16 z-30 border-y border-[#e6d8cb] bg-[#faf5ef]/95 shadow-[0_2px_12px_rgba(40,15,18,0.03)] backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 pt-3 pb-2 sm:px-6 lg:px-8 space-y-3">
          {/* Top Line: Search Input & Filter Chips */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input matching reference */}
            <div className="relative w-full lg:max-w-md">
              <span className="sr-only">Search dish or ingredient</span>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#705e60]">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish or ingredient..."
                className="h-10 w-full rounded-2xl border border-[#e6d8cb] bg-white pl-10 pr-9 text-xs sm:text-sm text-[#1e1415] outline-none placeholder:text-[#8c797b] shadow-xs focus:border-[#541e24] focus:ring-1 focus:ring-[#541e24]/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#705e60] hover:text-[#1e1415]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Right: Filter Funnel & Dietary Chips matching reference */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none [-webkit-overflow-scrolling:touch]">
              {/* Filter Icon */}
              <div className="flex items-center pr-1 text-[#541e24] shrink-0">
                <Filter className="h-4 w-4" />
              </div>

              {/* Dietary Chips */}
              {DIETARY_CHIPS.map((chip) => {
                const isSelected = selectedDietary === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      setSelectedDietary(isSelected ? "ALL" : chip)
                    }
                    aria-pressed={isSelected}
                    className={`inline-flex shrink-0 items-center rounded-xl border px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all duration-200 ${
                      isSelected
                        ? "border-[#541e24] bg-[#541e24] text-white shadow-xs"
                        : "border-[#e6d8cb] bg-white text-[#523e41] hover:border-[#541e24]/40 hover:bg-[#fbf6f0]"
                    }`}
                  >
                    <span>{chip}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Line: Category Pills matching reference */}
          <CategoryNav
            categories={activeCategories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategorySelect}
            totalDishCount={filteredDishes.length}
            categoryCounts={categoryCounts}
          />
        </div>
      </div>

      {/* 5. Main Dish Collections */}
      <div
        id="menu-content"
        className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      >
        {/* Active Filter Clear banner if filtered */}
        {isFiltered && (
          <div className="flex items-center justify-between rounded-2xl border border-[#e6d8cb] bg-white p-3.5 shadow-xs text-xs sm:text-sm text-[#705e60]">
            <p>
              Filtered: Showing <strong className="text-[#1e1415]">{filteredDishes.length}</strong> items
              {selectedDietary !== "ALL" && ` in ${selectedDietary}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 font-bold text-[#541e24] hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Clear filters
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredDishes.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#e6d8cb] bg-white/70 p-12 text-center sm:p-16">
            <h3 className="font-serif text-2xl font-bold text-[#1e1415]">
              No dishes found
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#705e60] max-w-md mx-auto">
              We couldn&apos;t find any dishes matching your current criteria. Clear your filters or search keywords to view the complete menu.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#541e24] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#6e272f] transition"
            >
              View Full Menu
            </button>
          </div>
        )}

        {filteredDishes.length > 0 && (
          <PremiumMenuCarousel
            key={activeCategory || "all"}
            categories={activeCategories}
            activeCategory={activeCategory}
            dishes={filteredDishes}
            onDishClick={(dish: Dish) => setSelectedDishId(dish.id)}
            onCategoryChange={handleCategorySelect}
            onQuickAdd={handleQuickAdd}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            videoMenuEnabled={videoMenuEnabled}
          />
        )}
      </div>

      {/* 5. TRONX Culinary Story / About Us Section */}
      <TronxAboutSection restaurant={menu.restaurant} />

      {/* 6. Luxury TRONX Footer */}
      <TronxFooter
        restaurant={menu.restaurant}
        reservationsEnabled={reservationsEnabled}
        wifiEnabled={wifiEnabled}
        onOpenReservation={() => setReservationOpen(true)}
        onOpenWifi={() => setWifiOpen(true)}
      />

      {/* 6. Detail Modal */}
      {selectedDish ? (
        <DishDetailModal
          key={selectedDish.id}
          dish={selectedDish}
          onClose={() => setSelectedDishId(null)}
          canOrder={canOrder}
          orderingEnabled={tableOrderingEnabled}
          videoMenuEnabled={videoMenuEnabled}
          onAddToCart={addToCart}
        />
      ) : null}

      {/* 7. Reservation Panel */}
      {reservationsEnabled && reservationOpen && (
        <ReservationPanel
          restaurantSlug={menu.restaurant.slug}
          onClose={() => setReservationOpen(false)}
        />
      )}

      {/* 8. Wi-Fi Access Panel */}
      {wifiEnabled && wifiOpen && (
        <WifiAccessPanel
          slug={menu.restaurant.slug}
          onClose={() => setWifiOpen(false)}
        />
      )}

      {/* 9. Floating Cart Action Bar */}
      {tableOrderingEnabled && loadedCartKey === cartKey && cart.length > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-4 bottom-5 z-40 mx-auto flex max-w-lg items-center justify-between gap-4 rounded-full border border-[#dfb28e]/40 bg-[#541e24] px-6 py-3.5 text-left text-white shadow-2xl transition hover:scale-[1.02] active:scale-98 sm:inset-x-6 sm:bottom-6"
        >
          <span className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <ShoppingBag className="h-4 w-4 text-[#dfb28e]" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight">
                {cartCount} {cartCount === 1 ? "Item Selected" : "Items Selected"}
              </span>
              <span className="text-xs text-white/70">View cart</span>
            </div>
          </span>

          <span className="font-mono text-base font-extrabold text-[#dfb28e]">
            ₹{cartTotal.toFixed(2)} <span aria-hidden="true">→</span>
          </span>
        </button>
      )}

      {/* 10. Floating [ ✨ ASK TRONX ] Concierge Button matching reference */}
      <AskTronxConcierge
        dishes={menu.dishes}
        onSelectDish={(dish) => setSelectedDishId(dish.id)}
        onQuickAdd={handleQuickAdd}
        hasActiveCart={tableOrderingEnabled && loadedCartKey === cartKey && cart.length > 0}
      />

      {/* 11. Modal Cart Drawer */}
      {tableOrderingEnabled && cartOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={(event) => {
            if (event.target === event.currentTarget) setCartOpen(false);
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] border border-[#e6d8cb] bg-[#faf5ef] shadow-2xl sm:rounded-3xl">
            <header className="flex items-center justify-between border-b border-[#e6d8cb] px-6 py-5 bg-white">
              <div>
                <h2 id="cart-title" className="font-serif text-2xl font-bold text-[#1e1415]">
                  Your Order
                </h2>
                <p className="mt-0.5 text-xs text-[#705e60]">
                  {tableNumber ? `Table ${tableNumber}` : "Direct Table Ordering"}
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full border border-[#e6d8cb] text-[#541e24] transition hover:bg-[#faf5ef]"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-5 scrollbar-none">
              {cart.map((line) => {
                const dish = menu.dishes.find((entry) => entry.id === line.dishId);
                if (!dish)
                  return (
                    <p key={line.key} className="text-sm text-rose-700">
                      An item in your cart is no longer available.
                    </p>
                  );

                const addonNames = line.selections.flatMap((selection) =>
                  selection.addonIds
                    .map(
                      (id) =>
                        dish.addonGroups
                          ?.find((group) => group.id === selection.groupId)
                          ?.addons.find((addon) => addon.id === id)?.name,
                    )
                    .filter((name): name is string => Boolean(name)),
                );

                return (
                  <article
                    key={line.key}
                    className="rounded-2xl border border-[#e6d8cb] bg-white p-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#1e1415]">
                          {dish.name}
                        </h3>
                        {addonNames.length > 0 && (
                          <p className="mt-1 text-xs leading-relaxed text-[#705e60]">
                            {addonNames.join(" · ")}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-base text-[#541e24]">
                        ₹{priceForLine({ ...line, quantity: 1 }).toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#f5ebe1] pt-3">
                      <div className="flex items-center gap-1 rounded-full border border-[#e6d8cb] bg-[#faf5ef] p-1">
                        <button
                          aria-label={`Decrease ${dish.name} quantity`}
                          onClick={() => changeQuantity(line.key, -1)}
                          className="grid h-7 w-7 place-items-center rounded-full text-[#541e24] hover:bg-white"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-xs font-bold text-[#1e1415]">
                          {line.quantity}
                        </span>
                        <button
                          aria-label={`Increase ${dish.name} quantity`}
                          onClick={() => changeQuantity(line.key, 1)}
                          className="grid h-7 w-7 place-items-center rounded-full text-[#541e24] hover:bg-white"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          setCart((current) =>
                            current.filter((entry) => entry.key !== line.key),
                          )
                        }
                        className="text-xs font-bold text-[#8b3f43] underline underline-offset-4 hover:text-[#541e24]"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <footer className="border-t border-[#e6d8cb] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-xs font-bold text-[#8b3f43] underline underline-offset-4 hover:text-[#541e24]"
                >
                  Clear Selection
                </button>
                <div className="text-right">
                  <span className="block text-[11px] text-[#705e60] uppercase tracking-wider">
                    Total Due
                  </span>
                  <span className="font-mono text-xl font-extrabold text-[#541e24]">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {orderError && (
                <p role="alert" className="mb-3 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700">
                  {orderError}
                </p>
              )}

              <button
                type="button"
                disabled={
                  !canOrder ||
                  cart.length === 0 ||
                  submitting ||
                  cart.some(
                    (line) =>
                      !menu.dishes.some(
                        (dish) => dish.id === line.dishId && dish.isAvailable,
                      ),
                  )
                }
                onClick={() => void placeOrder()}
                className="h-12 w-full rounded-full bg-[#541e24] text-xs font-bold uppercase tracking-wider text-white shadow-xl transition hover:bg-[#6e272f] active:scale-98 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting
                  ? "Transmitting order to kitchen…"
                  : `Place Order · ₹${cartTotal.toFixed(2)}`}
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
