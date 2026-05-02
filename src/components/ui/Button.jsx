import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-500 ease-in-out focus:outline-none flex justify-center items-center gap-2";
  
  const variants = {
    primary: "bg-vintage-charcoal text-vintage-cream hover:bg-vintage-black shadow-soft hover:shadow-cinematic",
    secondary: "bg-transparent border border-vintage-charcoal text-vintage-charcoal hover:bg-vintage-charcoal hover:text-vintage-cream",
    ghost: "bg-transparent text-vintage-charcoal hover:bg-black/5"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
