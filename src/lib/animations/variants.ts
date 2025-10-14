export const pageRoot = {
  initial: { opacity: 0, scale: 0.97, y: 10 },
  animate:  { opacity: 1, scale: 1,    y: 0 },
  exit:     { opacity: 0, scale: 0.98, y: -6 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
};

export const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.08 } }
};

export const item = {
  hidden: { opacity: 0, scale: 0.97, y: 12 },
  visible: { opacity: 1, scale: 1,    y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
};

export const row = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1,   y: 0, transition: { duration: 0.30 } }
};

export const micro = {
  hover: { y: -3, scale: 1.02, boxShadow: "0 8px 28px rgba(0,0,0,0.18)" },
  tap:   { scale: 0.98 }
};
