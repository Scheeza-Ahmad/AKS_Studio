import React from 'react';

export const Input = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-medium text-vintage-charcoal/80 uppercase tracking-widest">{label}</label>}
      <input
        className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-vintage-charcoal/10 rounded-xl focus:outline-none focus:border-vintage-charcoal/50 focus:bg-white transition-all duration-300 ${className}`}
        {...props}
      />
    </div>
  );
};
