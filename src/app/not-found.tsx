import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, EmptyState } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-20">
      <EmptyState
        icon={<Compass />}
        title="This page went off the map"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/">Go to homepage</ButtonLink>
            <ButtonLink href="/providers" variant="secondary">
              Find a doctor
            </ButtonLink>
          </div>
        }
      >
        <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      </EmptyState>
    </Container>
  );
}
