import { motion } from "framer-motion";

export const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 1.02, y: -10 },
};

export const pageTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="h-full w-full"
  >
    {children}
  </motion.div>
);

export default PageTransition;
