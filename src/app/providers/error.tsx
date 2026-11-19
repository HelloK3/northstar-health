"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container, EmptyState } from "@/components/ui/primitives";

/*
 * If anything under /providers throws while rendering, Next.js shows this
 * instead of a blank or broken page. `retry` re-renders the failed section.
 */
export default function ProvidersError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <EmptyState
        icon={<TriangleAlert />}
        title="We couldn't load providers"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => retry()}>
              <RotateCcw aria-hidden="true" /> Try again
            </Button>
            <ButtonLink href="/" variant="secondary">
              Go to homepage
            </ButtonLink>
          </div>
        }
      >
        <p>Something went wrong on our end. Please try again. If you need care now, call (612) 555-0110.</p>
      </EmptyState>
    </Container>
  );
}
