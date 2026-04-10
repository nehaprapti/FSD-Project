import React from "react";
import { motion } from "motion/react";

export const GlassCard = ({ children, className = "", ...props }: any) => (
  <div className={`glass p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: any) => {
  const base =
    "px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-[#0B0B0B] hover:bg-[#E6C200]",
    outline: "border border-white/20 text-white hover:bg-white/10",
    danger:
      "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30",
    ghost: "text-white/70 hover:text-white hover:bg-white/10",
  };
  return (
    <button
      className={`${base} ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, icon: Icon, className = "", ...props }: any) => (
  <div className={`flex flex-col gap-1.5 mb-4 w-full ${className}`}>
    {label && <label className="text-sm text-white/70 ml-1">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
          <Icon size={18} />
        </div>
      )}
      <input
        className={`w-full bg-black/20 border border-white/10 rounded-xl py-3 text-white focus:border-primary focus:outline-none transition-colors ${Icon ? "pl-11 pr-4" : "px-4"}`}
        {...props}
      />
    </div>
  </div>
);

export const ScreenTransition = ({
  children,
  keyId,
  className = "",
}: {
  children: React.ReactNode;
  keyId: string;
  className?: string;
}) => (
  <motion.div
    key={keyId}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className={`w-full h-full ${className}`}
  >
    {children}
  </motion.div>
);

export const MapBackground = ({ children }: { children?: React.ReactNode }) => (
  <div className="absolute inset-0 z-0 bg-dark overflow-hidden">
    <div className="absolute inset-0 map-grid" />
    <div className="absolute inset-0 bg-linear-to-t from-dark via-transparent to-transparent opacity-80" />
    {children}
  </div>
);
