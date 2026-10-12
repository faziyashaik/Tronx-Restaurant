import type { RestaurantMenu } from "@/types";

export const demoMenu: RestaurantMenu = {
  restaurant: {
    id: "moai-kitchen",
    name: "Moai Kitchen",
    slug: "moai-kitchen",
    logoUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
    coverUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    tagline: "Haute Gastronomy & Cinematic Food Craft",
    description: "An artisan dining experience celebrating culinary film, wood-fired roasting, and slow-simmered sauces.",
    phone: "+91 80 4123 5678",
    email: "concierge@tronxdining.com",
    address: "84 Lavelle Road, Richmond Circle, Bengaluru 560001",
    openingHours: "Mon – Sun: 12:00 PM – 11:30 PM",
    isOpen: true,
    isActive: true,
  },

  categories: [
    {
      id: "cat-1",
      name: "Starters",
      description: "Crisp artisanal bites and palate openers made with seasonal garden herbs.",
      sortOrder: 1,
      isActive: true,
    },
    {
      id: "cat-2",
      name: "Main Course",
      description: "Signature slow-braised curries, wood-fired cuts, and heirloom family recipes.",
      sortOrder: 2,
      isActive: true,
    },
    {
      id: "cat-3",
      name: "Snacks",
      description: "Handcrafted small bites, crispy street delicacies, and savory tapas.",
      sortOrder: 3,
      isActive: true,
    },
    {
      id: "cat-4",
      name: "Pasta",
      description: "Fresh extruded bronze-die ribbons tossed with slow-simmered regional sauces.",
      sortOrder: 4,
      isActive: true,
    },
    {
      id: "cat-5",
      name: "Pizza",
      description: "48-hour fermented wood-fired Neapolitan dough with artisanal cheeses.",
      sortOrder: 5,
      isActive: true,
    },
    {
      id: "cat-6",
      name: "Desserts",
      description: "Decadent chocolates, warm baked pastries, and traditional sweet finishes.",
      sortOrder: 6,
      isActive: true,
    },
    {
      id: "cat-7",
      name: "Beverages",
      description: "Botanical cold-pressed infusions, house brews, and sparkling refreshers.",
      sortOrder: 7,
      isActive: true,
    },
  ],

  dishes: [
    // --- STARTERS (3) ---
    {
      id: "dish-1",
      categoryId: "cat-1",
      name: "Chicken Tikka",
      description:
        "Smoky grilled chicken marinated in roasted tandoori spices, hung curd, and mustard oil.",
      price: 299,
      imageUrl:
        "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["HALAL", "GLUTEN FREE", "NUT FREE"],
      sortOrder: 1,
      addonGroups: [
        {
          id: "addon-group-1",
          name: "Choose Dip",
          isRequired: true,
          minSelect: 1,
          maxSelect: 1,
          addons: [
            { id: "ad-1", name: "Smoky Garlic Aioli", price: 0, isAvailable: true },
            { id: "ad-2", name: "Mint Herb Chutney", price: 0, isAvailable: true },
            { id: "ad-3", name: "Truffle Mayo", price: 40, isAvailable: true },
          ],
        },
      ],
    },
    {
      id: "dish-2",
      categoryId: "cat-1",
      name: "Paneer Tikka",
      description:
        "Charred fresh cottage cheese cubes infused with Kashmiri degi mirch, ajwain, and bell peppers.",
      price: 249,
      imageUrl:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "GLUTEN FREE", "NUT FREE"],
      sortOrder: 2,
    },
    {
      id: "dish-15",
      categoryId: "cat-1",
      name: "Hara Bhara Kebab",
      description:
        "Nutritious spinach, green peas, and fresh herb kebabs blended with roasted gram and royal cumin.",
      price: 229,
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isChefsChoice: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "VEGAN", "NUT FREE"],
      sortOrder: 3,
    },
    {
      id: "dish-21",
      categoryId: "cat-1",
      name: "Tandoori Malai Broccoli",
      description:
        "Tender charred florets steeped in rich cardamom cream, roasted green chillies, and melted cheddar.",
      price: 269,
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isChefsChoice: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "GLUTEN FREE"],
      sortOrder: 4,
    },
    {
      id: "dish-22",
      categoryId: "cat-1",
      name: "Crispy Calamari Rings",
      description:
        "Flash-fried salt and pepper squid rings tossed with fresh kaffir lime, crushed coriander, and roasted garlic dip.",
      price: 349,
      imageUrl:
        "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      isSignature: false,
      isAvailable: true,
      dietaryTags: ["HALAL", "NUT FREE"],
      sortOrder: 5,
    },
    {
      id: "dish-23",
      categoryId: "cat-1",
      name: "Amritsari Fish Tikka",
      description:
        "Crisp carom-scented river sole goujons fried in cold-pressed mustard oil with tart amchur and mint glaze.",
      price: 379,
      imageUrl:
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["HALAL", "GLUTEN FREE", "NUT FREE"],
      sortOrder: 6,
    },

    // --- MAIN COURSE (3) ---
    {
      id: "dish-3",
      categoryId: "cat-2",
      name: "Smoky Butter Chicken Royale",
      description:
        "Tender tandoor-roasted chicken in a rich, velvety tomato butter gravy with hand-crushed fenugreek.",
      price: 389,
      imageUrl:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["HALAL", "GLUTEN FREE"],
      sortOrder: 1,
    },
    {
      id: "dish-4",
      categoryId: "cat-2",
      name: "Slow-Simmered Dal Makhani",
      description:
        "Black lentils slow-cooked overnight over glowing embers with cultured white butter and vine tomatoes.",
      price: 299,
      imageUrl:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isChefsChoice: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "GLUTEN FREE"],
      sortOrder: 2,
    },
    {
      id: "dish-5",
      categoryId: "cat-2",
      name: "Signature Brioche Burger",
      description:
        "Double-stacked artisan patty, caramelized onions, aged cheddar, crisp romaine, and secret sauce on brioche.",
      price: 299,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["HALAL"],
      sortOrder: 3,
    },

    // --- SNACKS (3) ---
    {
      id: "dish-6",
      categoryId: "cat-3",
      name: "Truffle Parmesan Hand-Cut Fries",
      description:
        "Crispy golden russet potatoes tossed in black truffle oil, fresh parsley, and microplane parmesan.",
      price: 199,
      imageUrl:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "GLUTEN FREE", "NUT FREE"],
      sortOrder: 1,
    },
    {
      id: "dish-7",
      categoryId: "cat-3",
      name: "Crispy Sweet Corn Chaat",
      description:
        "Batter-crisped sweet corn kernels tossed with chaat masala, freshly squeezed lime, and coriander.",
      price: 179,
      imageUrl:
        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN FREE", "NUT FREE"],
      sortOrder: 2,
    },
    {
      id: "dish-8",
      categoryId: "cat-3",
      name: "Loaded Guacamole Nachos",
      description:
        "Hand-smashed Hass avocado with jalapeño, lime, pico de gallo, and warm blue corn tortilla crisps.",
      price: 249,
      imageUrl:
        "https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isChefsChoice: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "GLUTEN FREE"],
      sortOrder: 3,
    },

    // --- PASTA (3) ---
    {
      id: "dish-9",
      categoryId: "cat-4",
      name: "Smoked Garlic Fettuccine Alfredo",
      description:
        "Fresh fettuccine ribbons enveloped in velvety roasted garlic cream and cracked tellicherry pepper.",
      price: 349,
      imageUrl:
        "https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "NUT FREE"],
      sortOrder: 1,
    },
    {
      id: "dish-10",
      categoryId: "cat-4",
      name: "Calabrian Chilli Arrabbiata Penne",
      description:
        "Penne tossed with crushed San Marzano plum tomatoes, spicy Calabrian chillies, and torn sweet basil.",
      price: 319,
      imageUrl:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "VEGAN", "NUT FREE"],
      sortOrder: 2,
    },
    {
      id: "dish-11",
      categoryId: "cat-4",
      name: "Truffle Wild Mushroom Tagliatelle",
      description:
        "Ribbons of egg pasta tossed with sautéed porcini mushrooms, white truffle oil, and aged parmesan.",
      price: 379,
      imageUrl:
        "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isChefsChoice: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "NUT FREE"],
      sortOrder: 3,
    },

    // --- PIZZA (3) ---
    {
      id: "dish-12",
      categoryId: "cat-5",
      name: "Artisan Burrata Margherita Pizza",
      description:
        "Wood-fired 48-hour fermented dough with San Marzano sauce, fresh mozzarella, Puglia burrata, and basil.",
      price: 399,
      imageUrl:
        "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "NUT FREE"],
      sortOrder: 1,
    },
    {
      id: "dish-13",
      categoryId: "cat-5",
      name: "Diavola Hot Honey Pepperoni Pizza",
      description:
        "Crispy pepperoni, spicy nduja paste, fior di latte, and a finish of artisan wildflower chili hot honey.",
      price: 449,
      imageUrl:
        "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
      isVeg: false,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["HALAL", "NUT FREE"],
      sortOrder: 2,
    },
    {
      id: "dish-14",
      categoryId: "cat-5",
      name: "Wild Forest Mushroom & Truffle Pizza",
      description:
        "Bianca base with roasted wild forest mushrooms, thyme, smoked provolone, and white truffle oil drizzle.",
      price: 429,
      imageUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isChefsChoice: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "NUT FREE"],
      sortOrder: 3,
    },

    // --- DESSERTS (3) ---
    {
      id: "dish-16",
      categoryId: "cat-6",
      name: "Belgian Chocolate Lava Brownie",
      description:
        "Warm fudgy Belgian chocolate brownie drizzled with hot dark ganache and Madagascar vanilla bean gelato.",
      price: 179,
      imageUrl:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN"],
      sortOrder: 1,
    },
    {
      id: "dish-17",
      categoryId: "cat-6",
      name: "Classic Espresso Tiramisu Jar",
      description:
        "Espresso-soaked savoiardi biscuits, velvety mascarpone sabayon, and high-fat Dutch cocoa dust.",
      price: 219,
      imageUrl:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isChefsChoice: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "NUT FREE"],
      sortOrder: 2,
    },
    {
      id: "dish-18",
      categoryId: "cat-6",
      name: "Baked Saffron Cardamom Cheesecake",
      description:
        "Slow-baked New York style cheesecake infused with Kashmiri saffron strands and ground green cardamom.",
      price: 239,
      imageUrl:
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "GLUTEN FREE"],
      sortOrder: 3,
    },

    // --- BEVERAGES (2) ---
    {
      id: "dish-19",
      categoryId: "cat-7",
      name: "Fresh Garden Mint Mojito",
      description:
        "Zesty muddled lime, crushed spearmint, cane sugar, and sparkling mineral soda over cracked crystal ice.",
      price: 149,
      imageUrl:
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-1.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isSignature: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN FREE", "NUT FREE", "HALAL"],
      sortOrder: 1,
    },
    {
      id: "dish-20",
      categoryId: "cat-7",
      name: "Single-Origin Cold Brew Coffee",
      description:
        "18-hour slow-steeped Arabica single-origin cold brew poured over clear ice blocks with cocoa notes.",
      price: 169,
      imageUrl:
        "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
      videoUrl: "/videos/food-video-2.mp4",
      videoPosterUrl:
        "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
      isVeg: true,
      isChefsChoice: true,
      isAvailable: true,
      dietaryTags: ["VEGETARIAN", "VEGAN", "GLUTEN FREE", "NUT FREE", "HALAL"],
      sortOrder: 2,
    },
  ],
};
