import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Accessible form fields.
 *
 * Every input gets:
 *   - a visible <label> connected by id (clicking the label focuses the input,
 *     and screen readers read the label when the input is focused)
 *   - optional hint text and error text, connected with aria-describedby
 *   - aria-invalid when there is an error, so assistive tech announces it
 *
 * useId() creates a unique id per component instance, so ids never collide
 * even when the same component is used many times on one page.
 */

const control =
  "block w-full rounded-control border border-ink-300 bg-white px-3.5 text-ink-900 " +
  "placeholder:text-ink-500 transition-colors hover:border-ink-500 " +
  "focus-visible:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-0 " +
  "aria-invalid:border-danger-700 disabled:bg-ink-50 disabled:text-ink-500";

type FieldShellProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
};

function FieldShell({ id, label, hint, error, required, hideLabel, className, children }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-sm font-semibold text-ink-800", hideLabel && "sr-only")}>
        {label}
        {required && (
          <span className="ml-0.5 text-danger-700" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink-600">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-danger-700">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: ReactNode, error?: string) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

type SharedProps = {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  hideLabel?: boolean;
  wrapperClassName?: string;
};

export function TextField({
  label,
  hint,
  error,
  hideLabel,
  wrapperClassName,
  className,
  id: idProp,
  ...props
}: SharedProps & ComponentProps<"input">) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={props.required}
      hideLabel={hideLabel}
      className={wrapperClassName}
    >
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, "h-11", className)}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  hideLabel,
  wrapperClassName,
  className,
  id: idProp,
  children,
  ...props
}: SharedProps & ComponentProps<"select">) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={props.required}
      hideLabel={hideLabel}
      className={wrapperClassName}
    >
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, "h-11 appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10", className)}
        style={{
          // A small chevron drawn as an inline SVG, since we hid the native arrow
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5b70' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  hideLabel,
  wrapperClassName,
  className,
  id: idProp,
  ...props
}: SharedProps & ComponentProps<"textarea">) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={props.required}
      hideLabel={hideLabel}
      className={wrapperClassName}
    >
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, "min-h-28 py-2.5", className)}
        {...props}
      />
    </FieldShell>
  );
}

export function Checkbox({
  label,
  description,
  className,
  id: idProp,
  ...props
}: { label: ReactNode; description?: ReactNode } & Omit<ComponentProps<"input">, "type">) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <div className={cn("flex gap-3", className)}>
      <input
        id={id}
        type="checkbox"
        aria-describedby={description ? `${id}-desc` : undefined}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-brand-600"
        {...props}
      />
      <div className="text-sm">
        <label htmlFor={id} className="cursor-pointer font-medium text-ink-800">
          {label}
        </label>
        {description && (
          <p id={`${id}-desc`} className="text-ink-600">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
