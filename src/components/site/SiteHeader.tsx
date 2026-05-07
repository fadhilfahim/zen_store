"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/CartProvider";

export function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { itemCount, hydrated } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/75 backdrop-blur">
      <nav className="flex items-center justify-between px-4 md:px-10 py-3 bg-[rgb(var(--zen-bg))] shadow-sm">

        {/* LOGO */}
        <Link href="/" aria-label="ZEN Home">
          <Image
            src="/image.png"
            alt="ZEN Logo"
            width={140}
            height={40}
            priority
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-[rgb(var(--zen-muted))]">
          <li>
            <Link href="/" className="font-semibold hover:text-[rgb(var(--zen-fg))]">
              Home
            </Link>
          </li>
          <li>
            <Link href="/shop" className="font-semibold hover:text-[rgb(var(--zen-fg))]">
              Collections
            </Link>
          </li>
          <li>
            <Link href="/shop?sale=1" className="font-semibold hover:text-[rgb(var(--zen-fg))]">
              Sale
            </Link>
          </li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* SHOP */}
          <Link
            href="/shop"
            aria-label="Shop"
            className="text-[rgb(var(--zen-muted))] hover:text-[rgb(var(--zen-fg))]"
          >
            {/* Simple grid/shop icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shop" viewBox="0 0 16 16">
              <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z"/>
            </svg>
          </Link>
          {/* CART */}
          <Link
            href="/cart"
            className="relative text-[rgb(var(--zen-muted))] hover:text-[rgb(var(--zen-fg))]"
          >
            {/* ORIGINAL SVG */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
              />
            </svg>

            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white">
              {hydrated ? itemCount : "…"}
            </span>
          </Link>

          {/* HAMBURGER */}
          <button
            className="md:hidden flex flex-col gap-[4px]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span className={`w-5 h-[2px] bg-[rgb(var(--zen-muted))] transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`w-5 h-[2px] bg-[rgb(var(--zen-muted))] transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-[2px] bg-[rgb(var(--zen-muted))] transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col gap-4 px-6 py-4 bg-[rgb(var(--zen-bg))] backdrop-blur-xl border-t">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/shop" onClick={() => setIsMenuOpen(false)}>
            Collections
          </Link>
          <Link href="/shop?sale=1" onClick={() => setIsMenuOpen(false)}>
            Sale
          </Link>
        </div>
      </div>
    </header>
  );
}

