import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <Image
        src="/herobg.jpg"
        alt="ZEN Clothing"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 text-white">
        <button className="mb-6 w-fit rounded-full border border-white/60 px-4 py-1 text-xs tracking-wide transition hover:bg-white hover:text-black">
          NEW COLLECTION
        </button>

        <h1 className="text-5xl font-bold leading-[0.9] tracking-tight md:text-7xl">
          no noise.
          <br />
          just ZEN
        </h1>

        <Link href="/shop" className="mt-8 w-fit">
          <span className="inline-flex px-6 py-3 bg-white text-black text-sm tracking-wide transition hover:bg-gray-200">
            Start Shopping
          </span>
        </Link>
      </div>
      {/*********** DIV for Small two overlay images **********/}
      {/* <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        <div className="relative h-20 w-20 overflow-hidden rounded sm:h-24 sm:w-24">
          <Image src="/herobg.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative h-20 w-20 overflow-hidden rounded sm:h-24 sm:w-24">
          <Image src="/herobg.jpg" alt="" fill className="object-cover" />
        </div>
      </div> */}
    </section>
  );
}

