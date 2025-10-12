import { motion } from "framer-motion";

export const pageVariants = {
  initial: { opacity: 0, scale: 1.05, filter: "blur(8px)" },
  in: { opacity: 1, scale: 1, filter: "blur(0px)" },
  out: { opacity: 0, scale: 0.98, filter: "blur(6px)" },
};

export const pageTransition = {
  duration: 0.8,
  ease: [0.4, 0.0, 0.2, 1],
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

export default PageTransition;
