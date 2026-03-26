import { startTransition, useDeferredValue, useState } from "react";
import { Helmet } from "react-helmet-async";
import ArticleCard from "../components/ui/ArticleCard";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import { articles, blogCategories } from "../data/content";

function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Wszystko");
  const deferredSearch = useDeferredValue(searchTerm);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === "Wszystko" || article.category === activeCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      article.summary.toLowerCase().includes(deferredSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Blog | Movid Psychodietetyka</title>
        <meta
          name="description"
          content="Blog marki Movid Psychodietetyka z tekstami o relacji z jedzeniem, nawykach i dietetyce klinicznej."
        />
      </Helmet>

      <section className="section-shell pt-8">
        <SectionHeading
          eyebrow="Blog"
          title="Robocza sekcja artykułów o psychodietetyce, nawykach i spokojniejszym podejściu do jedzenia."
          description="Ta część serwisu pozwala już pracować nad SEO, tone of voice i strukturą wpisów jeszcze przed startem strony."
        />

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="input-shell max-w-xl"
            placeholder="Szukaj artykułów"
            aria-label="Szukaj artykułów"
          />
          <div className="flex flex-wrap gap-3">
            {blogCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => startTransition(() => setActiveCategory(category))}
                className={`chip-button ${activeCategory === category ? "chip-button-active" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <Reveal key={article.slug} delay={index * 0.06}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>

        {!filteredArticles.length ? (
          <div className="glass-panel mt-10 p-8 text-center">
            <h2 className="text-3xl">Nie znaleziono artykułów dla tego wyszukiwania</h2>
            <p className="mt-4">Spróbuj szerszego hasła albo zmień kategorię, aby zobaczyć wszystkie wpisy.</p>
          </div>
        ) : null}
      </section>
    </>
  );
}

export default BlogPage;
