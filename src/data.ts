export type Product = {
  id: string;
  category: "Smartphones" | "Wearables" | "Audio" | "Accessories" | "Tablets";
  brand: string;
  model: string;
  price: number;
  oldPrice?: number;
  storage?: string; // Optional for non-smartphones/tablets
  ram?: string;     // Optional
  condition: "Brand New" | "Refurbished" | "Pre-owned";
  color: string;
  badge?: string;
  emoji: string;
  gradient: string;
  description?: string;
  imageUrl?: string;
};

export const GRADIENTS = [
  { label: "Slate Dark", value: "from-slate-700 to-slate-900" },
  { label: "Zinc Black", value: "from-zinc-800 to-black" },
  { label: "Indigo Purple", value: "from-indigo-700 to-purple-900" },
  { label: "Blue Slate", value: "from-blue-900 to-slate-900" },
  { label: "Purple Fuchsia", value: "from-purple-600 to-fuchsia-700" },
  { label: "Sky Cyan", value: "from-sky-500 to-cyan-700" },
  { label: "Stone Dark", value: "from-stone-700 to-stone-900" },
  { label: "Blue Deep", value: "from-blue-700 to-blue-900" },
  { label: "Emerald Teal", value: "from-emerald-600 to-teal-800" },
  { label: "Rose Pink", value: "from-rose-500 to-pink-700" },
  { label: "Amber Orange", value: "from-amber-500 to-orange-700" },
  { label: "Gray Neutral", value: "from-gray-600 to-gray-800" },
];

export const defaultProducts: Product[] = [
  {
    id: "p1",
    category: "Smartphones",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    price: 165000,
    oldPrice: 185000,
    storage: "256GB",
    ram: "8GB",
    condition: "Brand New",
    color: "Titanium Blue",
    badge: "Hot Deal",
    emoji: "📱",
    gradient: "from-slate-700 to-slate-900",
    description: "The iPhone 15 Pro Max features a stunning 6.7-inch Super Retina XDR display, the powerful A17 Pro chip, a pro camera system with 5x optical zoom, and titanium design. All-day battery life, USB-C, and Action button.",
    imageUrl: "/images/iphone15promax.jpg",
  },
  {
    id: "p2",
    category: "Smartphones",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    price: 142000,
    storage: "512GB",
    ram: "12GB",
    condition: "Brand New",
    color: "Titanium Black",
    badge: "New",
    emoji: "📱",
    gradient: "from-zinc-800 to-black",
    description: "Samsung Galaxy S24 Ultra with Galaxy AI, 200MP camera, built-in S Pen, Snapdragon 8 Gen 3 processor, 6.8-inch QHD+ Dynamic AMOLED display, and titanium frame. The ultimate productivity powerhouse.",
    imageUrl: "/images/galaxy-s24-ultra.jpg",
  },
  {
    id: "p3",
    category: "Smartphones",
    brand: "Google",
    model: "Pixel 8 Pro",
    price: 95000,
    oldPrice: 110000,
    storage: "128GB",
    ram: "12GB",
    condition: "Brand New",
    color: "Obsidian",
    emoji: "📱",
    gradient: "from-indigo-700 to-purple-900",
    description: "Google Pixel 8 Pro with Tensor G3 chip, 50MP main camera with Magic Eraser and Best Take, 6.7-inch LTPO OLED display, 7 years of OS updates, and the purest Android experience.",
    imageUrl: "/images/pixel8pro.jpg",
  },
  {
    id: "w1",
    category: "Wearables",
    brand: "Apple",
    model: "Watch Ultra 2",
    price: 98000,
    oldPrice: 115000,
    condition: "Brand New",
    color: "Titanium Orange",
    badge: "Special Edition",
    emoji: "⌚",
    gradient: "from-orange-500 to-rose-600",
    description: "The ultimate sports and adventure watch is back. Featuring the S9 SiP, a magical new way to use your watch without touching the screen, a mind-blowing bright display, and carbon-neutral case and strap combinations.",
    imageUrl: "/images/apple-watch.jpg",
  },
  {
    id: "a1",
    category: "Audio",
    brand: "Apple",
    model: "AirPods Pro 2",
    price: 28000,
    oldPrice: 34000,
    condition: "Brand New",
    color: "White",
    emoji: "🎧",
    gradient: "from-slate-100 to-zinc-300",
    description: "AirPods Pro 2 feature up to two times more Active Noise Cancellation, Adaptive Audio, Transparancy mode, and Personalized Spatial Audio with dynamic head tracking for truly immersive sound.",
    imageUrl: "/images/iphone12.jpg",
  },
  {
    id: "ac1",
    category: "Accessories",
    brand: "Anker",
    model: "Prime 67W 3-Port Charger",
    price: 6500,
    oldPrice: 8500,
    condition: "Brand New",
    color: "Black",
    badge: "Must Buy",
    emoji: "🔌",
    gradient: "from-zinc-700 to-zinc-900",
    description: "Power up to 3 devices simultaneously with the Anker Prime 67W wall charger. Equipped with GaN technology, ActiveShield 2.0 temperature monitoring, and ultra-compact folding design. Perfect for your iPhone, Galaxy, and MacBook.",
    imageUrl: "/images/galaxy-a55.jpg",
  },
  {
    id: "p4",
    category: "Smartphones",
    brand: "Apple",
    model: "iPhone 13",
    price: 68000,
    oldPrice: 85000,
    storage: "128GB",
    ram: "4GB",
    condition: "Refurbished",
    color: "Midnight",
    badge: "Best Seller",
    emoji: "📱",
    gradient: "from-blue-900 to-slate-900",
    description: "Certified refurbished iPhone 13 with A15 Bionic chip, dual-camera system, 6.1-inch Super Retina XDR display. Fully tested, reset, and comes with 6-month Ndovukuu warranty.",
    imageUrl: "/images/iphone13.jpg",
  },
  {
    id: "t1",
    category: "Tablets",
    brand: "Apple",
    model: "iPad Air 11\" M2",
    price: 92000,
    oldPrice: 105000,
    storage: "128GB",
    ram: "8GB",
    condition: "Brand New",
    color: "Space Gray",
    emoji: "平板",
    gradient: "from-indigo-900 to-purple-900",
    description: "The redesigned 11-inch iPad Air is supercharged by the incredibly fast Apple M2 chip. It features a stunning Liquid Retina display, a new landscape camera perfect for FaceTime or video calls, and superfast Wi-Fi 6E.",
    imageUrl: "/images/iphone12.jpg",
  },
  {
    id: "ac2",
    category: "Accessories",
    brand: "Anker",
    model: "PowerCore 20,000mAh Power Bank",
    price: 5200,
    condition: "Brand New",
    color: "Midnight Black",
    emoji: "🔋",
    gradient: "from-slate-800 to-zinc-950",
    description: "Keep your devices powered for days on end with the massive 20K capacity. Charge your phone up to 5 times. High-speed PowerIQ charging technology delivers customized, optimal power delivery.",
    imageUrl: "/images/tecno-camon30.jpg",
  },
  {
    id: "p5",
    category: "Smartphones",
    brand: "Xiaomi",
    model: "Redmi Note 13 Pro",
    price: 32000,
    storage: "256GB",
    ram: "8GB",
    condition: "Brand New",
    color: "Aurora Purple",
    emoji: "📱",
    gradient: "from-purple-600 to-fuchsia-700",
    description: "Redmi Note 13 Pro with 200MP main camera, Snapdragon 7s Gen 2, 6.67-inch 120Hz AMOLED display, 5100mAh battery with 67W turbo charging. Flagship features at an unbeatable price.",
    imageUrl: "/images/redmi-note13.jpg",
  },
  {
    id: "w2",
    category: "Wearables",
    brand: "Samsung",
    model: "Galaxy Watch 6 Classic",
    price: 36000,
    oldPrice: 42000,
    condition: "Brand New",
    color: "Silver",
    emoji: "⌚",
    gradient: "from-stone-300 to-zinc-500",
    description: "Get the iconic rotatable bezel, personalized heart rate zones, advanced sleep coaching, body composition analysis, and flawless integration with Galaxy smartphones.",
    imageUrl: "/images/galaxy-a55.jpg",
  },
  {
    id: "ac3",
    category: "Accessories",
    brand: "Ndovukuu Case",
    model: "Ultra-Armor MagSafe Case",
    price: 1800,
    condition: "Brand New",
    color: "Clear / Graphite",
    emoji: "🛡️",
    gradient: "from-emerald-600 to-teal-800",
    description: "Ndovukuu's signature ultra-durable smartphone case. Complete with built-in powerful MagSafe magnets, 10ft military-grade drop protection, raised camera protection bezel, and non-yellowing crystal clear backing.",
    imageUrl: "/images/tecno-camon30.jpg",
  },
];

export type Service = {
  title: string;
  description: string;
  icon: string;
  price: string;
  duration: string;
};

export const services: Service[] = [
  {
    title: "Screen Replacement",
    description: "Cracked or shattered screen? We replace it with OEM-grade displays that look and feel original.",
    icon: "🖥️",
    price: "From KSh 2,500",
    duration: "30 – 90 mins",
  },
  {
    title: "Battery Replacement",
    description: "Phone draining fast? Get a genuine battery swap to restore all-day battery life.",
    icon: "🔋",
    price: "From KSh 1,800",
    duration: "20 – 45 mins",
  },
  {
    title: "Water Damage Recovery",
    description: "Liquid spill or full submersion? Our technicians use ultrasonic cleaning to bring it back to life.",
    icon: "💧",
    price: "From KSh 3,000",
    duration: "24 – 48 hrs",
  },
  {
    title: "Charging Port Repair",
    description: "Loose cable or no charging? We clean, repair or replace the port with precision soldering.",
    icon: "🔌",
    price: "From KSh 1,500",
    duration: "30 – 60 mins",
  },
  {
    title: "Software & Unlocking",
    description: "Stuck on a bootloop, forgot your passcode, or need a network unlock? We've got you covered.",
    icon: "⚙️",
    price: "From KSh 1,000",
    duration: "15 – 60 mins",
  },
  {
    title: "Camera & Speaker Fix",
    description: "Blurry camera or muffled speaker? We replace modules with precision tools and tested parts.",
    icon: "📸",
    price: "From KSh 2,000",
    duration: "45 – 90 mins",
  },
];

export const testimonials = [
  {
    name: "Brian Kimani",
    role: "Software Engineer",
    text: "My iPhone screen was completely shattered. Ndovukuu fixed it in 45 minutes and it looks brand new. Best repair shop in Nairobi!",
    rating: 5,
    initial: "BK",
  },
  {
    name: "Aisha Mohammed",
    role: "Student",
    text: "Bought a refurbished iPhone 13 here last year. Still works perfectly. Great prices and honest staff.",
    rating: 5,
    initial: "AM",
  },
  {
    name: "Peter Otieno",
    role: "Business Owner",
    text: "They saved my Samsung after I dropped it in water. Thought it was dead — picked it up the next day fully working.",
    rating: 5,
    initial: "PO",
  },
];
