import Form from "next/form";
import { Search } from "lucide-react";
import { locations } from "@/data/locations";
import { searchableSpecialties } from "@/lib/search";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/field";

/*
 * The homepage search form.
 *
 * <Form> from next/form is a regular HTML form with a GET action. On submit it
 * puts the field values into the URL (/providers?q=...&specialty=...) and
 * navigates there without a full page reload. Because it's a real form, it
 * still works if JavaScript fails to load (progressive enhancement).
 */
export function HeroSearch() {
  return (
    <Form
      action="/providers"
      role="search"
      aria-label="Find a doctor"
      className="grid gap-4 rounded-card bg-white p-5 shadow-raised sm:p-6 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end"
    >
      <TextField
        name="q"
        label="Condition, specialty, or name"
        placeholder="e.g. knee pain, Dr. Chen"
        autoComplete="off"
      />
      <SelectField name="specialty" label="Specialty" defaultValue="">
        <option value="">All specialties</option>
        {searchableSpecialties.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </SelectField>
      <SelectField name="location" label="Location" defaultValue="">
        <option value="">All locations</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>
            {l.address.city}: {l.name}
          </option>
        ))}
      </SelectField>
      <Button type="submit" size="md" className="w-full md:w-auto">
        <Search aria-hidden="true" /> Search
      </Button>
    </Form>
  );
}
