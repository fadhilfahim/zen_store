import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import Hero from "@/components/site/Hero";
import { Container } from "@/components/layout/Container";
import { getProducts } from "@/lib/store";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      <Hero />

      <section>
        <Container className="py-14 sm:py-18">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Featured Products</h2>
              <p className="mt-2 text-sm text-muted">
                A curated edit from the latest drop.
              </p>
            </div>
            <ButtonLink href="/shop" variant="ghost">
              View all
            </ButtonLink>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

