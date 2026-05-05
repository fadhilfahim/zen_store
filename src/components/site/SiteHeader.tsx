"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/CartProvider";

export function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount, hydrated } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/75 backdrop-blur">
      <nav className="flex flex-wrap items-center justify-between px-10 py-2 bg-[rgb(var(--zen-bg))] shadow-sm">
        <Link href="/" aria-label="ZEN Home">
          <Image
            src="/image.png"
            alt="ZEN Logo"
            width={140}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <ul className="flex items-center gap-6 text-sm text-[rgb(var(--zen-muted))]">
          <li>
            <Link
              href="/"
              className="font-semibold transition hover:text-[rgb(var(--zen-fg))]"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/shop"
              className="font-semibold transition hover:text-[rgb(var(--zen-fg))]"
            >
              Collections
            </Link>
          </li>
          <li>
            <Link
              href="/shop?sale=1"
              className="font-semibold transition hover:text-[rgb(var(--zen-fg))]"
            >
              Sale
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-6">
          <ul className="flex items-center gap-6">
            <li className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="text-[rgb(var(--zen-muted))] transition hover:text-[rgb(var(--zen-fg))]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <div
                className={`transition-all duration-300 ${
                  isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 focus-within:ring-2 focus-within:ring-black-400">
                  <input
                    type="search"
                    name="search"
                    id="search"
                    aria-label="Search"
                    placeholder="Search..."
                    autoFocus={isSearchOpen}
                    onBlur={() => setIsSearchOpen(false)}
                    className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  />
                </div>
              </div>
            </li>

            <li className="relative">
              <Link
                href="/cart"
                aria-label="Cart"
                className="block text-[rgb(var(--zen-muted))] transition hover:text-[rgb(var(--zen-fg))]"
              >
                <svg
                  className="h-6 w-6"
                  aria-hidden="true"
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
            </li>

            {/* <li>
              <button
                type="button"
                aria-label="Notifications"
                className="text-[rgb(var(--zen-muted))] transition hover:text-[rgb(var(--zen-fg))]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
            </li>

            <li>
              <button
                type="button"
                aria-label="Bookmarks"
                className="text-[rgb(var(--zen-muted))] transition hover:text-[rgb(var(--zen-fg))]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </button>
            </li> */}

          </ul>
        </div>
      </nav>
    </header>
  );
}

