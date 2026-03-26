import { motion } from "framer-motion";
import { useScrollProgress } from "../../hooks/use-scroll-progress";

function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed left-0 top-0 z-[70] h-1 w-full origin-left bg-gradient-to-r from-gold-200 via-sage-500 to-sage-700"
      style={{ scaleX: progress }}
    />
  );
}

export default ScrollProgress;
