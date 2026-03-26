import Reveal from "./Reveal";

function Timeline({ items }) {
  return (
    <div className="relative grid gap-6">
      <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-gold-200 via-sage-300 to-transparent md:block" />
      {items.map((item, index) => (
        <Reveal key={item.year} delay={index * 0.06}>
          <article className="grid gap-4 md:grid-cols-[3.5rem_1fr]">
            <div className="flex items-start justify-center">
              <div className="mt-2 hidden size-10 items-center justify-center rounded-full border border-white/60 bg-white/80 text-xs font-semibold uppercase tracking-[0.18em] text-sage-700 shadow-insetGlow backdrop-blur md:flex dark:border-white/10 dark:bg-white/5 dark:text-gold-100">
                {item.year}
              </div>
            </div>
            <div className="premium-card">
              <p className="text-sm uppercase tracking-[0.24em] text-sage-600 dark:text-gold-100">
                {item.year}
              </p>
              <h3 className="mt-3 text-3xl">{item.title}</h3>
              <p className="mt-4">{item.copy}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export default Timeline;
