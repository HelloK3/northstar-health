import type { Location } from "@/lib/types";

/*
 * Fictional facilities. Northstar is set in Minnesota ("the North Star
 * State"), but every address and phone number here is made up.
 * The 555-01xx phone range is reserved for fiction.
 */
export const locations: Location[] = [
  {
    id: "northstar-medical-center",
    name: "Northstar Medical Center",
    type: "Medical Center",
    description:
      "Our flagship campus brings primary care, specialty clinics, imaging, and a full-service lab together under one roof.",
    address: { street: "1200 Polaris Avenue", city: "Cedar Falls", state: "MN", zip: "55901" },
    phone: "(612) 555-0110",
    hours: [
      { days: "Monday – Friday", hours: "7:00 AM – 7:00 PM" },
      { days: "Saturday", hours: "8:00 AM – 2:00 PM" },
      { days: "Sunday", hours: "Closed" },
    ],
    services: ["Primary care", "Specialty clinics", "Imaging & radiology", "Laboratory", "Pharmacy"],
    amenities: ["Free parking garage", "Wheelchair accessible", "Interpreter services", "Café"],
    mapPosition: { x: 48, y: 44 },
  },
  {
    id: "lakeside-clinic",
    name: "Lakeside Family Clinic",
    type: "Clinic",
    description:
      "A neighborhood clinic focused on families, with pediatrics and primary care side by side and same-day sick visits.",
    address: { street: "48 Shoreline Drive", city: "Lakeside", state: "MN", zip: "55912" },
    phone: "(612) 555-0124",
    hours: [
      { days: "Monday – Friday", hours: "8:00 AM – 6:00 PM" },
      { days: "Saturday", hours: "9:00 AM – 1:00 PM" },
      { days: "Sunday", hours: "Closed" },
    ],
    services: ["Primary care", "Pediatrics", "Same-day sick visits", "Vaccinations", "Laboratory"],
    amenities: ["Free surface parking", "Wheelchair accessible", "Family restroom", "Kids' play area"],
    mapPosition: { x: 22, y: 30 },
  },
  {
    id: "riverbend-specialty",
    name: "Riverbend Specialty Center",
    type: "Specialty Center",
    description:
      "Heart, brain, and hormone care with on-site diagnostic testing, so most visits need only one trip.",
    address: { street: "730 Mill Race Road", city: "Riverbend", state: "MN", zip: "55934" },
    phone: "(612) 555-0138",
    hours: [
      { days: "Monday – Thursday", hours: "7:30 AM – 5:30 PM" },
      { days: "Friday", hours: "7:30 AM – 4:00 PM" },
      { days: "Saturday – Sunday", hours: "Closed" },
    ],
    services: ["Cardiology", "Neurology", "Endocrinology", "Cardiac testing (EKG, echo)", "Laboratory"],
    amenities: ["Valet parking", "Wheelchair accessible", "Interpreter services"],
    mapPosition: { x: 72, y: 66 },
  },
  {
    id: "northgate-clinic",
    name: "Northgate Health Clinic",
    type: "Clinic",
    description:
      "Convenient care on the north side, with extended weekday hours, skin care, and women's health.",
    address: { street: "2215 Aurora Parkway", city: "Northgate", state: "MN", zip: "55920" },
    phone: "(612) 555-0147",
    hours: [
      { days: "Monday – Friday", hours: "7:00 AM – 8:00 PM" },
      { days: "Saturday – Sunday", hours: "9:00 AM – 3:00 PM" },
    ],
    services: ["Primary care", "Dermatology", "Women's health", "Laboratory"],
    amenities: ["Free parking", "Wheelchair accessible", "Near Line 4 bus stop"],
    mapPosition: { x: 56, y: 16 },
  },
  {
    id: "pinewood-ortho",
    name: "Pinewood Orthopedics & Wellness",
    type: "Specialty Center",
    description:
      "Orthopedic care, physical therapy, and behavioral health in a calm, light-filled space built for recovery.",
    address: { street: "95 Timber Lane", city: "Pinewood", state: "MN", zip: "55948" },
    phone: "(612) 555-0156",
    hours: [
      { days: "Monday – Friday", hours: "7:00 AM – 6:00 PM" },
      { days: "Saturday", hours: "8:00 AM – 12:00 PM" },
      { days: "Sunday", hours: "Closed" },
    ],
    services: ["Orthopedics", "Physical therapy", "Sports medicine", "Behavioral health", "X-ray"],
    amenities: ["Free parking", "Wheelchair accessible", "Accessible exam rooms"],
    mapPosition: { x: 30, y: 74 },
  },
];

export function getLocation(id: string) {
  return locations.find((l) => l.id === id);
}
