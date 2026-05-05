import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultProducts,
  services,
  testimonials,
  GRADIENTS,
  type Product,
} from "./data";

/* ─── constants ─── */
const WHATSAPP = "254713985655";
const ADMIN_PIN = "ndovu2024";
const STORAGE_KEY = "ndovukuu_products";

type CartItem = { product: Product; qty: number };
type Page = "home" | "product" | "admin";

/* ─── persistence ─── */
function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return defaultProducts;
}
function saveProducts(p: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

const fmt = (n: number) => "KSh " + n.toLocaleString();

/* ─── WhatsApp helpers ─── */
function buildWhatsAppUrl(items: CartItem[]) {
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  let msg = "🐘 *Ndovukuu Electronics & Repair Store Order*\n\nHi, I'd like to order:\n\n";
  items.forEach((it) => {
    const specs = it.product.storage ? ` (${it.product.storage}, ${it.product.color})` : ` (${it.product.color})`;
    msg += `• *${it.product.brand} ${it.product.model}*${specs}\n  Category: ${it.product.category}\n  Condition: ${it.product.condition}\n  Qty: ${it.qty} × ${fmt(it.product.price)} = ${fmt(it.product.price * it.qty)}\n\n`;
  });
  msg += `💰 *Total: ${fmt(total)}*\n\nPlease confirm availability and delivery. Asante! 🙏`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

function buildSingleWhatsAppUrl(product: Product) {
  let msg = `🐘 *Ndovukuu Electronics Inquiry*\n\nHi, I'm interested in:\n\n`;
  msg += `📱 *${product.brand} ${product.model}*\n`;
  msg += `• Category: ${product.category}\n`;
  if (product.storage) msg += `• Storage: ${product.storage}\n`;
  if (product.ram) msg += `• RAM: ${product.ram}\n`;
  msg += `• Color: ${product.color}\n`;
  msg += `• Condition: ${product.condition}\n`;
  msg += `• Price: ${fmt(product.price)}\n`;
  if (product.oldPrice) msg += `• Was: ${fmt(product.oldPrice)}\n`;
  msg += `\nIs this still available? Asante! 🙏`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

/* ─── Product visual (reused) ─── */
function ProductVisual({
  product,
  className = "",
  size = "md",
}: {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt={product.model}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  const sz = size === "sm" ? "text-3xl" : size === "lg" ? "text-8xl" : "text-5xl";
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <span className={`${sz} drop-shadow-xl`}>{product.emoji}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOGO
   ═══════════════════════════════════════════════════════ */
function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 shadow-lg shadow-orange-500/25">
        <span className="text-xl leading-none">🐘</span>
      </div>
      <div className="leading-tight">
        <div
          className={`text-[1.1rem] font-black tracking-tight ${light ? "text-white" : "text-slate-900"}`}
        >
          ndovu<span className="text-orange-500">kuu</span>
        </div>
        <div
          className={`text-[9px] font-semibold uppercase tracking-[0.22em] ${light ? "text-slate-400" : "text-slate-500"}`}
        >
          Repairs · Sales
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════ */
function Navbar({
  cartCount,
  onCartClick,
  onHome,
  page,
}: {
  cartCount: number;
  onCartClick: () => void;
  onHome: () => void;
  page: Page;
}) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#shop", label: "Shop" },
    { href: "#repairs", label: "Repairs" },
    { href: "#why", label: "Why Us" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <button onClick={onHome} className="cursor-pointer">
          <Logo />
        </button>

        {page === "home" && (
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3.5 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={onCartClick}
            className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
          >
            🛒 <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>

          {page === "home" && (
            <a
              href="#book"
              className="hidden rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 sm:inline-block"
            >
              Book Repair
            </a>
          )}

          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-base md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-2">
            {page === "home" &&
              links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-slate-50 py-3 text-sm font-semibold text-slate-700"
                >
                  {l.label}
                </a>
              ))}
            {page === "home" && (
              <a
                href="#book"
                onClick={() => setOpen(false)}
                className="mt-3 mb-2 rounded-full bg-slate-900 py-3 text-center text-sm font-semibold text-white"
              >
                Book Repair
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950">
      <div className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-orange-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-amber-500/15 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
            Trusted since 2018 · Nairobi
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            Mighty repairs.{" "}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Quality electronics.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300/90 sm:text-lg">
            Shattered screen? Slow device? Or shopping for the latest phone, charger, or smartwatch? Ndovukuu has you covered with top-tier service.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#shop"
              className="group relative rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-600/25 transition hover:shadow-orange-600/40"
            >
              Shop Catalog
              <span className="ml-1.5 inline-block transition group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#book"
              className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Book a Repair
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-7">
            {[
              { val: "12k+", label: "Phones Fixed" },
              { val: "98%", label: "Same-day Fix" },
              { val: "6 mo", label: "Warranty" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-white sm:text-3xl">
                  {s.val}
                </div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* hero image */}
        <div className="order-1 lg:order-2 relative">
          <div className="absolute inset-0 -rotate-3 rounded-3xl bg-gradient-to-br from-orange-500/25 to-rose-500/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src="/images/hero-repair.jpg"
              alt="Phone repair at Ndovukuu"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-white">
                  Open Now · Walk-ins Welcome
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* brand bar */}
      <div className="relative border-t border-white/[0.06] bg-white/[0.03] py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-6 px-5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30">
          <span>Apple</span>
          <span>Samsung</span>
          <span>Anker</span>
          <span>Google</span>
          <span>Xiaomi</span>
          <span>Tecno</span>
          <span>Oraimo</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════════════ */
function Services() {
  return (
    <section id="repairs" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-600">
            Repair Services
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            We fix what others can't
          </h2>
          <p className="mt-3 text-slate-500">
            Certified technicians, genuine parts, 6-month warranty on every
            repair.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/50"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 text-2xl shadow-sm">
                  {s.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {s.description}
                </p>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                  <span className="text-sm font-bold text-orange-600">
                    {s.price}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    ⏱ {s.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PRODUCT CARD
   ═══════════════════════════════════════════════════════ */
function ProductCard({
  product,
  onAdd,
  onView,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  onView: (p: Product) => void;
}) {
  const cond =
    product.condition === "Brand New"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : product.condition === "Refurbished"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60">
      {/* image area */}
      <button
        onClick={() => onView(product)}
        className={`relative aspect-[4/3] overflow-hidden cursor-pointer bg-gradient-to-br ${product.gradient}`}
      >
        <ProductVisual
          product={product}
          className="transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
            {product.badge}
          </span>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md ${cond}`}
        >
          {product.condition}
        </span>
      </button>

      {/* info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          {product.brand} · {product.category}
        </div>
        <button
          onClick={() => onView(product)}
          className="mt-1 text-left text-[1.05rem] font-bold leading-snug text-slate-900 transition hover:text-orange-600 cursor-pointer"
        >
          {product.model}
        </button>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {product.storage && (
            <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {product.storage}
            </span>
          )}
          {product.ram && (
            <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {product.ram} RAM
            </span>
          )}
          <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {product.color}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            {product.oldPrice && (
              <div className="text-[11px] font-medium text-slate-400 line-through">
                {fmt(product.oldPrice)}
              </div>
            )}
            <div className="text-xl font-black tracking-tight text-slate-900">
              {fmt(product.price)}
            </div>
          </div>
          <button
            onClick={() => onAdd(product)}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-500"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHOP
   ═══════════════════════════════════════════════════════ */
function Shop({
  products,
  onAdd,
  onView,
}: {
  products: Product[];
  onAdd: (p: Product) => void;
  onView: (p: Product) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");

  const categories = ["All", "Smartphones", "Wearables", "Audio", "Tablets", "Accessories"];

  // Filter based on selected category first
  const productsInCategory = useMemo(() => {
    return activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  // Compute available brands dynamically for current category
  const brands = useMemo(() => {
    return ["All", ...Array.from(new Set(productsInCategory.map((p) => p.brand)))];
  }, [productsInCategory]);

  // Apply brand filter if active
  const list = useMemo(() => {
    return activeBrand === "All"
      ? productsInCategory
      : productsInCategory.filter((p) => p.brand === activeBrand);
  }, [activeBrand, productsInCategory]);

  // Reset brand filter if category changes
  useEffect(() => {
    setActiveBrand("All");
  }, [activeCategory]);

  return (
    <section id="shop" className="bg-slate-50/70 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-600">
              Shop Ndovukuu
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Certified Electronics & Accessories
            </h2>
            <p className="mt-2 max-w-lg text-slate-500">
              Explore professional tech. Fully checked and tested by our technicians with 6-month warranty.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 max-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  "rounded-xl px-4 py-2 text-xs font-bold transition " +
                  (activeCategory === cat
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-600 hover:text-slate-900")
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Filter (Sub-filter) */}
        {brands.length > 2 && (
          <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-slate-200/50 pt-5">
            <span className="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider">Filter by Brand:</span>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setActiveBrand(b)}
                className={
                  "rounded-full px-3 py-1.5 text-xs font-bold transition " +
                  (activeBrand === b
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 shadow-sm border border-slate-200/50 hover:bg-slate-50")
                }
              >
                {b}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.length === 0 && (
            <p className="col-span-full py-16 text-center text-slate-400">
              No products found in this category.
            </p>
          )}
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} onView={onView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PRODUCT VIEW
   ═══════════════════════════════════════════════════════ */
function ProductView({
  product,
  products,
  onAdd,
  onBack,
  onWhatsApp,
  onView,
}: {
  product: Product;
  products: Product[];
  onAdd: (p: Product) => void;
  onBack: () => void;
  onWhatsApp: (p: Product) => void;
  onView: (p: Product) => void;
}) {
  const cond =
    product.condition === "Brand New"
      ? "bg-emerald-50 text-emerald-700"
      : product.condition === "Refurbished"
        ? "bg-blue-50 text-blue-700"
        : "bg-amber-50 text-amber-700";

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <section className="min-h-[80vh] bg-slate-50/70 py-8 lg:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:text-orange-600"
        >
          ← Back to catalog
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl">
          <div className="grid lg:grid-cols-2">
            {/* image */}
            <div
              className={`relative flex items-center justify-center bg-gradient-to-br ${product.gradient} p-6 min-h-[380px] lg:min-h-[520px]`}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.model}
                  className="max-h-[460px] w-full object-contain drop-shadow-2xl"
                />
              ) : (
                <ProductVisual product={product} size="lg" />
              )}
              {product.badge && (
                <span className="absolute left-5 top-5 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  {product.badge}
                </span>
              )}
            </div>

            {/* details */}
            <div className="flex flex-col p-7 sm:p-10">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-500">
                {product.brand} · {product.category}
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {product.model}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${cond}`}
                >
                  {product.condition}
                </span>
                {product.storage && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {product.storage}
                  </span>
                )}
                {product.ram && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {product.ram} RAM
                  </span>
                )}
                <span
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {product.color}
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  {fmt(product.price)}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      {fmt(product.oldPrice)}
                    </span>
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600">
                      Save {fmt(product.oldPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {product.description && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    About this product
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-2">
                {[
                  { icon: "🛡️", label: "6-Month Warranty" },
                  { icon: "🚚", label: "Free Delivery" },
                  { icon: "✅", label: "Tested & Certified" },
                  { icon: "💰", label: "Pay on Delivery" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5"
                  >
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-2.5 pt-8 sm:flex-row">
                <button
                  onClick={() => onAdd(product)}
                  className="flex-1 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={() => onWhatsApp(product)}
                  className="flex-1 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition hover:brightness-110"
                >
                  💬 Buy via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-bold text-slate-900">
              More related products
            </h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={onAdd}
                  onView={onView}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   WHY US
   ═══════════════════════════════════════════════════════ */
function Why() {
  const items = [
    {
      icon: "⚡",
      title: "Same-day Repairs",
      text: "Most fixes done in under 90 minutes while you wait.",
    },
    {
      icon: "🛡️",
      title: "6-Month Warranty",
      text: "Every repair & device sold is covered. No fine print.",
    },
    {
      icon: "💰",
      title: "Fair Prices",
      text: "Transparent quotes upfront. We even price-match.",
    },
    {
      icon: "🚚",
      title: "Free Delivery",
      text: "Free delivery on tech purchases within Nairobi.",
    },
  ];
  return (
    <section id="why" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-600">
              Why Ndovukuu
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              The strongest name in mobile repair & tech
            </h2>
            <p className="mt-4 leading-relaxed text-slate-500">
              "Ndovu" means elephant — strong, reliable, never forgets. That's
              how we treat every device. Whether it's a flagship iPhone, premium smartwatch, or a fast charger, you get the same world-class quality.
            </p>
            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
            >
              Visit our store <span>→</span>
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((it, i) => (
              <div
                key={it.title}
                className={`rounded-2xl p-6 ${i % 2 === 0 ? "bg-slate-50" : "bg-orange-50/60"}`}
              >
                <div className="text-3xl">{it.icon}</div>
                <h3 className="mt-3 font-bold text-slate-900">{it.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 py-20 lg:py-24 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-orange-600/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-orange-500/15 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-300 border border-orange-400/20">
            Happy Customers
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Loved by 12,000+ Kenyans
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-sm transition hover:border-white/15 hover:bg-white/[0.07]"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                "{t.text}"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-5">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-sm font-bold text-white shadow-lg">
                  {t.initial}
                </div>
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   BOOK REPAIR
   ═══════════════════════════════════════════════════════ */
function BookRepair() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="book" className="bg-slate-50/70 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/50">
          <div className="grid md:grid-cols-2">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 p-8 text-white sm:p-10">
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="relative">
                <span className="inline-block rounded-full bg-orange-500/15 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-300 border border-orange-400/20">
                  Book a Repair
                </span>
                <h3 className="mt-4 text-3xl font-black leading-tight">
                  Get a free quote in 60 seconds
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Tell us what's wrong. We'll WhatsApp you back with a price and
                  time slot.
                </p>
                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "Free diagnostics",
                    "No-fix, no-fee policy",
                    "Pickup & drop-off available",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2.5">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-400">
                        ✓
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4 p-8 sm:p-10"
            >
              {submitted ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="text-5xl">🎉</div>
                    <h4 className="mt-3 text-xl font-black text-slate-900">
                      Booking received!
                    </h4>
                    <p className="mt-2 text-sm text-slate-500">
                      We'll WhatsApp you within 15 minutes.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white"
                    >
                      Book another
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Your name
                    </label>
                    <input
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
                      placeholder="Jane Wanjiku"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Phone number
                    </label>
                    <input
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Device / Model
                      </label>
                      <input
                        required
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
                        placeholder="iPhone 13"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Issue
                      </label>
                      <select className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white">
                        <option>Cracked screen</option>
                        <option>Battery issue</option>
                        <option>Water damage</option>
                        <option>Charging port</option>
                        <option>Software / unlock</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40"
                  >
                    Get my free quote
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════════════ */
function Contact() {
  return (
    <section id="contact" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-600">
              Visit Us
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
              Come say jambo 👋
            </h2>
            <p className="mt-3 text-slate-500">
              We're in the heart of Nairobi CBD, easy walk from Kencom.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {[
              {
                icon: "📍",
                title: "Address",
                lines: ["Moi Avenue, 3rd Floor", "Tumaini House, Nairobi"],
              },
              {
                icon: "📞",
                title: "Call / WhatsApp",
                lines: ["+254 713 985 655", "Mon–Sat, 8am – 7pm"],
              },
              {
                icon: "✉️",
                title: "Email",
                lines: [
                  "hello@ndovukuu.co.ke",
                  "support@ndovukuu.co.ke",
                ],
              },
              {
                icon: "🕒",
                title: "Opening hours",
                lines: ["Mon – Sat: 8:00 – 19:00", "Sun: 10:00 – 16:00"],
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5"
              >
                <div className="text-2xl">{c.icon}</div>
                <h3 className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-900">
                  {c.title}
                </h3>
                {c.lines.map((l) => (
                  <p key={l} className="mt-1 text-sm text-slate-500">
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER — "ndovu" link opens admin
   ═══════════════════════════════════════════════════════ */
function Footer({ onAdmin }: { onAdmin: () => void }) {
  return (
    <footer className="bg-slate-950 py-14 text-slate-400">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Ndovukuu — Kenya's most trusted electronics repair and resale store.
              Built by technicians, for everyone.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { e: "📘", l: "Facebook" },
                { e: "📸", l: "Instagram" },
                { e: "🐦", l: "Twitter" },
                { e: "💬", l: "WhatsApp" },
              ].map((s) => (
                <a
                  key={s.l}
                  href="#"
                  title={s.l}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.06] bg-white/[0.03] transition hover:bg-orange-500 hover:border-orange-500"
                >
                  {s.e}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#shop" className="transition hover:text-white">
                  All Products
                </a>
              </li>
              <li>
                <a href="#shop" className="transition hover:text-white">
                  Apple
                </a>
              </li>
              <li>
                <a href="#shop" className="transition hover:text-white">
                  Samsung
                </a>
              </li>
              <li>
                <a href="#shop" className="transition hover:text-white">
                  Accessories
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Repairs
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#repairs" className="transition hover:text-white">
                  Screen
                </a>
              </li>
              <li>
                <a href="#repairs" className="transition hover:text-white">
                  Battery
                </a>
              </li>
              <li>
                <a href="#repairs" className="transition hover:text-white">
                  Water Damage
                </a>
              </li>
              <li>
                <a href="#book" className="transition hover:text-white">
                  Book Now
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-7 text-xs sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Ndovukuu Mobile Ltd. All rights
            reserved.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onAdmin}
              className="text-slate-600 transition hover:text-orange-500 cursor-pointer select-none"
              title="Admin"
            >
              ndovu
            </button>
            <span className="text-slate-700">·</span>
            <p>Made with 🐘 in Nairobi</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   CART DRAWER
   ═══════════════════════════════════════════════════════ */
function CartDrawer({
  open,
  onClose,
  items,
  setQty,
  remove,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
}) {
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    window.open(buildWhatsAppUrl(items), "_blank");
  };

  return (
    <>
      <div
        onClick={onClose}
        className={
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition duration-300 " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />
      <aside
        className={
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-black text-slate-900">Your Cart</h3>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-sm text-slate-600 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-50 text-4xl">
              🛒
            </div>
            <h4 className="mt-4 text-lg font-bold text-slate-900">
              Cart is empty
            </h4>
            <p className="mt-1 text-sm text-slate-500">
              Browse our catalog and add some products!
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white"
            >
              Shop catalog
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-2.5 overflow-y-auto p-5">
              {items.map((it) => (
                <div
                  key={it.product.id}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3"
                >
                  <div
                    className={`grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br ${it.product.gradient}`}
                  >
                    <ProductVisual product={it.product} size="sm" />
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {it.product.brand}
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {it.product.model}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {it.product.storage ? `${it.product.storage} · ` : ""}{it.product.color}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                        <button
                          onClick={() => setQty(it.product.id, it.qty - 1)}
                          className="h-7 w-7 text-sm font-bold text-slate-600"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-bold">
                          {it.qty}
                        </span>
                        <button
                          onClick={() => setQty(it.product.id, it.qty + 1)}
                          className="h-7 w-7 text-sm font-bold text-slate-600"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {fmt(it.product.price * it.qty)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(it.product.id)}
                    className="self-start rounded-lg p-1 text-xs text-slate-300 transition hover:text-rose-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 bg-white p-5 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>{fmt(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Delivery</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-black text-slate-900">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition hover:brightness-110"
              >
                💬 Checkout via WhatsApp
              </button>
              <p className="text-center text-[10px] text-slate-400">
                You'll be redirected to WhatsApp to confirm your order
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   ADMIN PANEL
   ═══════════════════════════════════════════════════════ */
function AdminPanel({
  phones,
  setPhones,
  onBack,
}: {
  phones: Product[];
  setPhones: (p: Product[]) => void;
  onBack: () => void;
}) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthed(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleDelete = (id: string) => {
    const updated = phones.filter((p) => p.id !== id);
    setPhones(updated);
    saveProducts(updated);
    setDeleteConfirm(null);
  };

  const handleSave = (phone: Product) => {
    let updated: Product[];
    if (phones.find((p) => p.id === phone.id)) {
      updated = phones.map((p) => (p.id === phone.id ? phone : p));
    } else {
      updated = [...phones, phone];
    }
    setPhones(updated);
    saveProducts(updated);
    setShowForm(false);
    setEditingPhone(null);
  };

  /* Login screen */
  if (!authed) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50/30 py-20">
        <div className="w-full max-w-sm px-5">
          <button
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-orange-600"
          >
            ← Back to site
          </button>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-3xl shadow-lg shadow-orange-500/25">
                🔐
              </div>
              <h2 className="mt-5 text-xl font-black text-slate-900">
                Admin Panel
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your PIN to manage products
              </p>
            </div>
            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter admin PIN"
                className={`w-full rounded-xl border px-4 py-3.5 text-center text-lg tracking-[0.3em] outline-none transition ${pinError ? "border-rose-300 bg-rose-50 shake" : "border-slate-200 bg-slate-50 focus:border-orange-400 focus:bg-white"}`}
              />
              {pinError && (
                <p className="text-center text-xs font-medium text-rose-500">
                  Incorrect PIN. Try again.
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Unlock →
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  /* Edit / Add form */
  if (showForm) {
    return (
      <AdminForm
        product={editingPhone}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingPhone(null);
        }}
      />
    );
  }

  /* Product list */
  return (
    <section className="min-h-[80vh] bg-gradient-to-br from-slate-50 to-orange-50/20 py-8 lg:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:text-orange-600"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                📦 Manage Catalog
              </h1>
              <p className="text-sm text-slate-500">
                {phones.length} product{phones.length !== 1 ? "s" : ""} listed
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingPhone(null);
              setShowForm(true);
            }}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40"
          >
            + Add New Product
          </button>
        </div>

        {phones.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white py-20 text-center shadow-sm">
            <div className="text-5xl">📱</div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">
              No products listed yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Click "Add New Product" to create your first listing.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {phones.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div
                  className={`grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br ${p.gradient}`}
                >
                  <ProductVisual product={p} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {p.brand} · {p.category}
                    </span>
                    {p.badge && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-bold text-orange-600">
                        {p.badge}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${p.condition === "Brand New" ? "bg-emerald-100 text-emerald-700" : p.condition === "Refurbished" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {p.condition}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 truncate">
                    {p.model}
                  </h3>
                  <div className="text-xs text-slate-400">
                    {p.storage ? `${p.storage} · ` : ""}{p.ram ? `${p.ram} · ` : ""}{p.color}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-black text-slate-900">
                    {fmt(p.price)}
                  </div>
                  {p.oldPrice && (
                    <div className="text-xs text-slate-400 line-through">
                      {fmt(p.oldPrice)}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => {
                      setEditingPhone(p);
                      setShowForm(true);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                  >
                    ✏️ Edit
                  </button>
                  {deleteConfirm === p.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-xl bg-rose-500 px-3.5 py-2 text-xs font-bold text-white"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Admin Add/Edit Form ─── */
function AdminForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null;
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState<Product>(
    product || {
      id: "p_" + Date.now(),
      category: "Smartphones",
      brand: "",
      model: "",
      price: 0,
      oldPrice: undefined,
      storage: "128GB",
      ram: "8GB",
      condition: "Brand New",
      color: "",
      badge: "",
      emoji: "📱",
      gradient: GRADIENTS[0].value,
      description: "",
      imageUrl: "",
    },
  );
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || "");

  const set = <K extends keyof Product>(key: K, val: Product[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      set("imageUrl", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      badge: form.badge || undefined,
      description: form.description || undefined,
      storage: form.storage || undefined,
      ram: form.ram || undefined,
    });
  };

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white";

  return (
    <section className="min-h-[80vh] bg-gradient-to-br from-slate-50 to-orange-50/20 py-8 lg:py-12">
      <div className="mx-auto max-w-3xl px-5">
        <button
          onClick={onCancel}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-orange-600"
        >
          ← Back to list
        </button>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
          <h2 className="text-2xl font-black text-slate-900">
            {isEdit ? "✏️ Edit Product" : "📦 Add New Product"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? "Update the listing details below"
              : "Fill in details to create a new product listing"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Category */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Product Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value as Product["category"])}
                className={inputCls}
              >
                {["Smartphones", "Wearables", "Audio", "Tablets", "Accessories"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Product Image
              </label>
              <div className="mt-2 flex items-start gap-4">
                <div
                  className={`grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-dashed ${imagePreview ? "border-orange-300 bg-orange-50" : "border-slate-200 bg-slate-50"}`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl">📷</div>
                      <div className="mt-0.5 text-[9px] text-slate-400">
                        No image
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-300">
                    📁 Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">
                    JPG, PNG — stored in browser.
                  </p>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Or paste URL
                    </label>
                    <input
                      value={form.imageUrl || ""}
                      onChange={(e) => {
                        set("imageUrl", e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className={inputCls}
                      placeholder="https://example.com/product.jpg"
                    />
                  </div>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        set("imageUrl", "");
                      }}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      ✕ Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Brand & Model */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Brand *
                </label>
                <input
                  required
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                  className={inputCls}
                  placeholder="Apple / Anker / Samsung"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Model *
                </label>
                <input
                  required
                  value={form.model}
                  onChange={(e) => set("model", e.target.value)}
                  className={inputCls}
                  placeholder="iPad Air M2"
                />
              </div>
            </div>

            {/* Prices */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Price (KSh) *
                </label>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.price || ""}
                  onChange={(e) => set("price", Number(e.target.value))}
                  className={inputCls}
                  placeholder="165000"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Old Price{" "}
                  <span className="normal-case text-slate-400">(optional)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.oldPrice || ""}
                  onChange={(e) =>
                    set(
                      "oldPrice",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className={inputCls}
                  placeholder="185000"
                />
              </div>
            </div>

            {/* Specs (Conditional display for Smartphones/Tablets/Wearables) */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Storage <span className="normal-case text-slate-400">(optional)</span>
                </label>
                <select
                  value={form.storage || ""}
                  onChange={(e) => set("storage", e.target.value || undefined)}
                  className={inputCls}
                >
                  <option value="">None / Not Applicable</option>
                  {["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"].map(
                    (s) => (
                      <option key={s} value={s}>{s}</option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  RAM <span className="normal-case text-slate-400">(optional)</span>
                </label>
                <select
                  value={form.ram || ""}
                  onChange={(e) => set("ram", e.target.value || undefined)}
                  className={inputCls}
                >
                  <option value="">None / Not Applicable</option>
                  {["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"].map(
                    (r) => (
                      <option key={r} value={r}>{r}</option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Condition *
                </label>
                <select
                  value={form.condition}
                  onChange={(e) =>
                    set("condition", e.target.value as Product["condition"])
                  }
                  className={inputCls}
                >
                  <option>Brand New</option>
                  <option>Refurbished</option>
                  <option>Pre-owned</option>
                </select>
              </div>
            </div>

            {/* Color & Badge */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Color *
                </label>
                <input
                  required
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  className={inputCls}
                  placeholder="Titanium Blue / White / Black"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Badge{" "}
                  <span className="normal-case text-slate-400">(optional)</span>
                </label>
                <input
                  value={form.badge || ""}
                  onChange={(e) => set("badge", e.target.value)}
                  className={inputCls}
                  placeholder="Hot Deal"
                />
              </div>
            </div>

            {/* Emoji & Gradient */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Fallback Emoji *
                </label>
                <select
                  value={form.emoji}
                  onChange={(e) => set("emoji", e.target.value)}
                  className={inputCls}
                >
                  {["📱", "⌚", "🎧", "🔌", "🔋", "🛡️", "💻", "📦"].map((emoji) => (
                    <option key={emoji}>{emoji}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Card Background Gradient
                </label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {GRADIENTS.slice(0, 8).map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => set("gradient", g.value)}
                      className={`aspect-[3/2] rounded-xl bg-gradient-to-br ${g.value} border-2 transition ${form.gradient === g.value ? "border-orange-500 ring-2 ring-orange-300 scale-105" : "border-transparent hover:border-slate-300"}`}
                      title={g.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Description{" "}
                <span className="normal-case text-slate-400">(optional)</span>
              </label>
              <textarea
                value={form.description || ""}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                className={inputCls + " resize-none"}
                placeholder="Describe the product — features, condition notes, compatibility, what's in the box…"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-slate-100 pt-6">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40"
              >
                {isEdit ? "💾 Save Changes" : "📦 Add Product"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:border-slate-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */
export default function App() {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const goHome = useCallback(() => {
    setPage("home");
    setViewProduct(null);
    window.scrollTo(0, 0);
  }, []);

  const goProduct = useCallback((p: Product) => {
    setViewProduct(p);
    setPage("product");
    window.scrollTo(0, 0);
  }, []);

  const goAdmin = useCallback(() => {
    setPage("admin");
    setViewProduct(null);
    window.scrollTo(0, 0);
  }, []);

  const add = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found)
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) return setCart((p) => p.filter((i) => i.product.id !== id));
    setCart((p) =>
      p.map((i) => (i.product.id === id ? { ...i, qty } : i)),
    );
  };

  const remove = (id: string) =>
    setCart((p) => p.filter((i) => i.product.id !== id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleSingleWhatsApp = useCallback((product: Product) => {
    window.open(buildSingleWhatsAppUrl(product), "_blank");
  }, []);

  useEffect(() => {
    if (viewProduct) {
      const updated = products.find((p) => p.id === viewProduct.id);
      if (updated) setViewProduct(updated);
    }
  }, [products]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onHome={goHome}
        page={page}
      />

      {page === "home" && (
        <>
          <Hero />
          <Services />
          <Shop products={products} onAdd={add} onView={goProduct} />
          <Why />
          <Testimonials />
          <BookRepair />
          <Contact />
        </>
      )}

      {page === "product" && viewProduct && (
        <ProductView
          product={viewProduct}
          products={products}
          onAdd={add}
          onBack={goHome}
          onWhatsApp={handleSingleWhatsApp}
          onView={goProduct}
        />
      )}

      {page === "admin" && (
        <AdminPanel phones={products} setPhones={setProducts} onBack={goHome} />
      )}

      <Footer onAdmin={goAdmin} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        setQty={setQty}
        remove={remove}
      />
    </div>
  );
}
