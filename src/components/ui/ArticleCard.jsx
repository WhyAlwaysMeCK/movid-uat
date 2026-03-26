import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function ArticleCard({ article }) {
  return (
    <article className="premium-card h-full">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-gold-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sage-700 dark:bg-white/5 dark:text-gold-100">
          {article.category}
        </span>
        <span className="text-sm text-ink-700/70 dark:text-ivory-100/60">{article.readTime}</span>
      </div>
      <h3 className="mt-5 text-3xl">{article.title}</h3>
      <p className="mt-4">{article.summary}</p>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm text-ink-700/70 dark:text-ivory-100/60">{article.publishedAt}</span>
        <Link
          to={`/blog/${article.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-sage-700 dark:text-gold-100"
        >
          Czytaj artykuł
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export default ArticleCard;
