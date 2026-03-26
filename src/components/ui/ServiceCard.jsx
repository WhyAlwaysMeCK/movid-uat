import { motion } from "framer-motion";
import { ArrowRight, Brain, HeartHandshake, Leaf, Scale, Sparkles, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap = {
  "psychology-signature": Brain,
  "psychology-couple": HeartHandshake,
  "psychology-burnout": Sparkles,
  "nutrition-clinical": Leaf,
  "nutrition-performance": Scale,
  "nutrition-family": UtensilsCrossed
};

function ServiceCard({ service, showLink = false }) {
  const Icon = iconMap[service.id] || Sparkles;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="premium-card flex h-full flex-col"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex size-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sage-100 to-gold-100 text-sage-700 dark:from-white/10 dark:to-gold-200/10 dark:text-gold-100">
          <Icon className="size-7" />
        </div>
        <div className="rounded-full bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sage-600 dark:bg-white/5 dark:text-gold-100">
          {service.category}
        </div>
      </div>

      <h3 className="mt-6 text-3xl">{service.name}</h3>
      <p className="mt-4">{service.summary}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <span className="stat-pill">{service.duration}</span>
        {service.price ? <span className="stat-pill">{service.price}</span> : null}
      </div>

      <ul className="mt-6 space-y-3">
        {service.benefits.map((benefit) => (
          <li key={benefit} className="flex gap-3 text-sm text-ink-700 dark:text-ivory-100/75">
            <span className="mt-2 size-1.5 rounded-full bg-gold-300" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {showLink ? (
        <Link to="/booking" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sage-700 dark:text-gold-100">
          Umów tę konsultację
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </motion.article>
  );
}

export default ServiceCard;
