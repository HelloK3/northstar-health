import { UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, EmptyState } from "@/components/ui/primitives";

export default function ProviderNotFound() {
  return (
    <Container className="py-16">
      <EmptyState
        icon={<UserRound />}
        title="We couldn't find that provider"
        action={<ButtonLink href="/providers">Search all providers</ButtonLink>}
      >
        <p>The link may be out of date, or the provider may no longer practice at Northstar Health.</p>
      </EmptyState>
    </Container>
  );
}
