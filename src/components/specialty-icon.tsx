import {
  Activity,
  Baby,
  Bone,
  Brain,
  Flower2,
  HeartPulse,
  MessageCircleHeart,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "primary-care": Stethoscope,
  pediatrics: Baby,
  cardiology: HeartPulse,
  dermatology: Sparkles,
  orthopedics: Bone,
  "womens-health": Flower2,
  "behavioral-health": MessageCircleHeart,
  neurology: Brain,
  endocrinology: Activity,
};

export function SpecialtyIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = icons[slug] ?? Stethoscope;
  return <Icon className={className} aria-hidden="true" />;
}
