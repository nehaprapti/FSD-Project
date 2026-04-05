import React from "react";
import { Link } from "react-router-dom";

interface LoginShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  role?: "passenger" | "driver" | "admin";
}

const LoginShell: React.FC<LoginShellProps> = ({ children, title, subtitle, role = "passenger" }) => {
  const bgImage = "/login-bg.png";

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-mesh">
      {/* Background Image Layer with Parallax-like effect */}
      <div 
        className="absolute inset-0 z-0 opacity-40 scale-110 animate-mesh"
        style={{
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(20%) brightness(0.8)",
        }}
      />
      
      {/* Animated Overlay Gradients */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-y-primary/20 via-transparent to-rx-black/40" />

      {/* Main Glass Card */}
      <div className={`relative z-20 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out 
        ${role === 'admin' ? 'glass-card-dark text-white' : 'glass-card text-rx-black' } 
        p-8 md:p-10 rounded-[32px]`}
      >
        {/* Brand/Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
            <h1 className="text-4xl font-extrabold tracking-tighter">
              <span className="text-y-primary">R</span>apidX
            </h1>
          </Link>
          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className={`${role === 'admin' ? 'text-rx-gray-400' : 'text-rx-gray-700'} text-sm font-medium`}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className={`text-xs ${role === 'admin' ? 'text-rx-gray-400' : 'text-rx-gray-400'} font-medium`}>
            &copy; 2026 RapidX Technologies Inc. 
            <br />
            Secure & encrypted login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginShell;
