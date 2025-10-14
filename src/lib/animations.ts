import { Variants } from 'framer-motion';

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: [0.2, 0.8, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: {
      duration: 0.18,
    },
  },
};

export const cardHoverVariants: Variants = {
  hover: {
    scale: 1.01,
    // The boxShadow bloom effect needs to be applied via Tailwind classes or a separate style prop
    // as framer-motion's boxShadow property doesn't directly translate to Tailwind's shadow classes.
    // This will be handled in the component's className or style prop.
    transition: {
      duration: 0.14,
    },
  },
};

export const headerIconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};
