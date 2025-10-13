import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  userName: string;
  subtitle: string;
}

function Header({ userName, subtitle }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-8 text-center md:text-left"
    >
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-2">Welcome back, {userName}</h1>
      <p className="text-foreground/70 text-sm">{subtitle}</p>
    </motion.div>
  );
}

export default Header;
