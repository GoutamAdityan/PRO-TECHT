import { motion } from 'framer-motion';

const HeroIllustration = () => {
  return (
    <motion.div
      className="relative w-full h-64 md:h-96"
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="absolute top-0 left-1/4 w-32 h-32 bg-accent rounded-full mix-blend-lighten filter blur-xl opacity-70"
        variants={{
          initial: { y: -20, scale: 0.9 },
          animate: { y: 20, scale: 1.1, transition: { duration: 5, repeat: Infinity, repeatType: 'reverse' } },
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-48 h-48 bg-card-bg rounded-full mix-blend-lighten filter blur-2xl opacity-50"
        variants={{
          initial: { y: 20, scale: 1.1 },
          animate: { y: -20, scale: 0.9, transition: { duration: 8, repeat: Infinity, repeatType: 'reverse' } },
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-accent rounded-lg mix-blend-lighten filter blur-sm opacity-30"
        variants={{
          initial: { rotate: 0, scale: 1 },
          animate: { rotate: 360, scale: 1.2, transition: { duration: 15, repeat: Infinity, repeatType: 'loop', ease: 'linear' } },
        }}
      />
    </motion.div>
  );
};

export default HeroIllustration;
