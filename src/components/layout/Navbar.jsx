import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { brand } from "../../data/content";

const navigation = [
  { label: "Start", to: "/" },
  { label: "O marce", to: "/about" },
  { label: "Oferta", to: "/services" },
  { label: "Rezerwacja", to: "/booking" },
  { label: "Blog", to: "/blog" },
  { label: "Kontakt", to: "/contact" }
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 px-5 pt-4 sm:px-6 lg:px-8">
        <div
          className={[
            "section-shell flex items-center justify-between rounded-full border px-4 py-3 transition duration-500 ease-luxury sm:px-6",
            isScrolled
              ? "border-white/60 bg-white/70 shadow-card backdrop-blur-xl dark:border-white/10 dark:bg-sage-800/70"
              : "border-transparent bg-white/35 backdrop-blur-md dark:bg-white/5"
          ].join(" ")}
        >
          <Link to="/" className="flex items-center gap-3" aria-label={`${brand.name} start`}>
            <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-sage-500 to-sage-700 font-display text-lg text-white shadow-lg shadow-sage-900/20">
              M
            </span>
            <div>
              <div className="font-display text-xl text-ink-900 dark:text-ivory-50">{brand.shortName}</div>
              <p className="text-xs uppercase tracking-[0.22em] text-sage-600 dark:text-gold-100">
                Psychodietetyka
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link className="luxury-button" to="/booking">
              Umów konsultację
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/50 bg-white/70 text-ink-900 dark:border-white/10 dark:bg-white/5 dark:text-ivory-50"
              aria-label="Otwórz menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/25 px-5 py-6 backdrop-blur-lg sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-panel mx-auto flex min-h-[70vh] max-w-xl flex-col p-6"
            >
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <p className="font-display text-2xl text-ink-900 dark:text-ivory-50">{brand.shortName}</p>
                  <p className="text-sm text-ink-700 dark:text-ivory-100/70">
                    Robocza wersja strony marki
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/50 bg-white/70 text-ink-900 dark:border-white/10 dark:bg-white/5 dark:text-ivory-50"
                  aria-label="Zamknij menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {navigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `rounded-3xl px-5 py-4 text-lg font-medium transition ${
                        isActive
                          ? "bg-sage-600 text-white"
                          : "bg-white/65 text-ink-900 dark:bg-white/5 dark:text-ivory-50"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <Link className="luxury-button mt-8" to="/booking" onClick={() => setIsOpen(false)}>
                Umów konsultację
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
