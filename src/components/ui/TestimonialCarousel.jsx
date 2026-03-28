import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";

function TestimonialCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5400);

    return () => window.clearInterval(intervalId);
  }, [items.length]);

  const activeItem = items[activeIndex];

  return (
    <div className="glass-panel relative overflow-hidden p-6 md:p-10">
      <Quote className="absolute right-5 top-5 size-10 text-gold-300/55 dark:text-gold-200/20 md:right-8 md:top-8 md:size-14" />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.name}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.45 }}
        >
          <p className="max-w-4xl text-xl font-medium leading-relaxed text-ink-900 dark:text-ivory-50 sm:text-2xl md:text-3xl">
            "{activeItem.quote}"
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-lg font-semibold text-ink-900 dark:text-ivory-50">{activeItem.name}</p>
              <p>{activeItem.role}</p>
            </div>
            <div className="max-w-full break-words rounded-full border border-gold-200/60 bg-gold-100/50 px-4 py-2 text-sm font-medium text-sage-700 dark:border-white/10 dark:bg-white/5 dark:text-gold-100">
              {activeItem.outcome}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex gap-2">
        {items.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View testimonial from ${item.name}`}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-12 bg-sage-600 dark:bg-gold-200" : "w-2.5 bg-sage-200 dark:bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialCarousel;
