import type { Specialty } from "@/lib/types";

export const specialties: Specialty[] = [
  {
    slug: "primary-care",
    name: "Primary Care",
    practitioner: "Primary Care Physician",
    description: "Annual checkups, preventive care, and your first stop for everyday health concerns.",
    conditions: ["annual physical", "cold", "flu", "blood pressure", "vaccines", "checkup"],
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    practitioner: "Pediatrician",
    description: "Care for infants, children, and teens, from well-child visits to sick days.",
    conditions: ["well-child visit", "ear infection", "asthma", "vaccines", "growth", "adhd"],
  },
  {
    slug: "cardiology",
    name: "Cardiology",
    practitioner: "Cardiologist",
    description: "Diagnosis and long-term care for conditions of the heart and blood vessels.",
    conditions: ["heart", "chest pain", "high cholesterol", "arrhythmia", "blood pressure"],
  },
  {
    slug: "dermatology",
    name: "Dermatology",
    practitioner: "Dermatologist",
    description: "Skin, hair, and nail care, including skin checks and chronic skin conditions.",
    conditions: ["acne", "eczema", "psoriasis", "skin check", "mole", "rash"],
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    practitioner: "Orthopedic Specialist",
    description: "Bones, joints, and muscles: sports injuries, joint pain, and recovery.",
    conditions: ["knee pain", "back pain", "sports injury", "fracture", "arthritis", "shoulder"],
  },
  {
    slug: "womens-health",
    name: "Women's Health",
    practitioner: "OB/GYN",
    description: "Gynecology, prenatal care, and care through every life stage.",
    conditions: ["pregnancy", "prenatal", "menopause", "annual exam", "contraception"],
  },
  {
    slug: "behavioral-health",
    name: "Behavioral Health",
    practitioner: "Behavioral Health Specialist",
    description: "Support for anxiety, depression, stress, and other mental health needs.",
    conditions: ["anxiety", "depression", "stress", "therapy", "sleep", "mental health"],
  },
  {
    slug: "neurology",
    name: "Neurology",
    practitioner: "Neurologist",
    description: "Conditions of the brain and nervous system, such as migraines and seizures.",
    conditions: ["migraine", "headache", "seizure", "memory", "numbness"],
  },
  {
    slug: "endocrinology",
    name: "Endocrinology",
    practitioner: "Endocrinologist",
    description: "Hormone and metabolic conditions, including diabetes and thyroid disorders.",
    conditions: ["diabetes", "thyroid", "hormones", "metabolism"],
  },
];

export function getSpecialty(slug: string) {
  return specialties.find((s) => s.slug === slug);
}
