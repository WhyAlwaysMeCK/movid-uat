import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { brand } from "../data/content";

function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Nie znaleziono strony | {brand.name}</title>
      </Helmet>

      <section className="section-shell pt-20">
        <div className="glass-panel mx-auto max-w-3xl p-10 text-center">
          <span className="eyebrow">404</span>
          <h1 className="mt-6 text-5xl">Ta strona nie istnieje w aktualnej wersji serwisu.</h1>
          <p className="mt-5">
            Link mógł się zmienić albo dana podstrona nie została jeszcze przygotowana. Możesz
            wrócić na start albo przejść do rezerwacji.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/" className="outline-button">
              <ArrowLeft className="mr-2 size-4" />
              Wróć na start
            </Link>
            <Link to="/booking" className="luxury-button">
              Przejdź do rezerwacji
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFoundPage;
