import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import ArticleCard from "../components/ui/ArticleCard";
import Reveal from "../components/ui/Reveal";
import { articles, brand } from "../data/content";

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((entry) => entry.slug === slug);

  if (!article) {
    return <Navigate to="/not-found" replace />;
  }

  const relatedArticles = articles.filter((entry) => entry.slug !== article.slug).slice(0, 2);

  return (
    <>
      <Helmet>
        <title>{article.title} | {brand.name}</title>
        <meta name="description" content={article.summary} />
      </Helmet>

      <article className="section-shell pt-8">
        <Reveal className="glass-panel p-8 sm:p-10 lg:p-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-sage-700 dark:text-gold-100">
            <ArrowLeft className="size-4" />
            Wróć do bloga
          </Link>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="eyebrow">{article.category}</span>
            <span className="stat-pill">{article.readTime}</span>
            <span className="stat-pill">{article.publishedAt}</span>
          </div>
          <h1 className="mt-8 max-w-4xl text-balance text-5xl sm:text-6xl">{article.title}</h1>
          <p className="mt-6 max-w-3xl text-lg">{article.summary}</p>
        </Reveal>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="glass-panel p-8 sm:p-10">
            {article.sections.map((section, index) => (
              <section key={section.heading} className={index < article.sections.length - 1 ? "mb-12" : ""}>
                <h2 className="text-3xl">{section.heading}</h2>
                <div className="mt-5 space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-4xl">Powiązane artykuły</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {relatedArticles.map((entry) => (
              <ArticleCard key={entry.slug} article={entry} />
            ))}
          </div>
        </section>
      </article>
    </>
  );
}

export default ArticlePage;
