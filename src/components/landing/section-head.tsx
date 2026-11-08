export function SectionHead({ id, kicker, title, text, center = false }: { id: string; kicker: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`reveal grid gap-6 ${center ? "mx-auto max-w-3xl text-center" : "lg:grid-cols-12 lg:items-end"}`}>
      <div className={center ? "" : "lg:col-span-7"}>
        <p className="mb-4 flex items-center gap-2 text-small font-semibold text-accent-text max-lg:justify-start">
          <span className={`h-px w-6 bg-accent ${center ? "hidden" : ""}`} aria-hidden />
          {kicker}
        </p>
        <h2 id={id} className="display text-head text-balance">{title}</h2>
      </div>
      {text && <p className={`text-lead leading-snug text-muted ${center ? "" : "lg:col-span-5"}`}>{text}</p>}
    </div>
  );
}
