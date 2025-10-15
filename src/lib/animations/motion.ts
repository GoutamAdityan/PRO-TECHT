
export const SMOOTH_EASE = [0.2, 0.8, 0.2, 1];

export const DURATION_SMALL = 0.22;
export const DURATION_MEDIUM = 0.35;
export const DURATION_LARGE = 0.5;

export const STAGGER_CHILDREN = 0.04;

export const motionProps = {
  transition: {
    duration: DURATION_MEDIUM,
    ease: SMOOTH_EASE,
  },
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};
