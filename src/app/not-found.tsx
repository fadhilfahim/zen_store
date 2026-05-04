import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm text-muted">404</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight">
          This page doesn’t exist.
        </h1>
        <p className="mt-3 text-pretty text-sm text-muted">
          The link may be broken or the page may have been moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/shop">Shop</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

