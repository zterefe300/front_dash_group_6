import { motion } from "motion/react";

interface FrontDashLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  animate?: boolean;
}

export function FrontDashLogo({ 
  size = "md", 
  variant = "full", 
  animate = false 
}: FrontDashLogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
    xl: "h-24"
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl"
  };

  const LogoIcon = () => (
    <motion.div
      className="relative"
      initial={animate ? { scale: 0, rotate: -180 } : {}}
      animate={animate ? { scale: 1, rotate: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <svg
        viewBox="0 0 60 60"
        className={`${sizeClasses[size]} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle
          cx="30"
          cy="30"
          r="28"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Inner Circle */}
        <circle
          cx="30"
          cy="30"
          r="24"
          fill="white"
        />
        
        {/* Delivery Truck Icon */}
        <g transform="translate(12, 20)">
          {/* Truck Body */}
          <rect
            x="0"
            y="6"
            width="20"
            height="8"
            rx="2"
            fill="currentColor"
            className="text-primary"
          />
          
          {/* Truck Cab */}
          <rect
            x="20"
            y="4"
            width="8"
            height="10"
            rx="2"
            fill="currentColor"
            className="text-primary"
          />
          
          {/* Windshield */}
          <rect
            x="22"
            y="6"
            width="4"
            height="4"
            rx="1"
            fill="white"
          />
          
          {/* Wheels */}
          <circle cx="6" cy="16" r="2" fill="currentColor" className="text-muted-foreground" />
          <circle cx="22" cy="16" r="2" fill="currentColor" className="text-muted-foreground" />
          
          {/* Speed Lines */}
          <motion.g
            initial={animate ? { x: -10, opacity: 0 } : {}}
            animate={animate ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <line x1="32" y1="8" x2="36" y2="8" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
            <line x1="30" y1="11" x2="34" y2="11" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
            <line x1="28" y1="14" x2="32" y2="14" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );

  const LogoText = () => (
    <motion.div
      className="flex items-center"
      initial={animate ? { x: -20, opacity: 0 } : {}}
      animate={animate ? { x: 0, opacity: 1 } : {}}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <span className={`font-bold text-primary ${textSizeClasses[size]}`}>
        Front
      </span>
      <span className={`font-bold text-foreground ${textSizeClasses[size]}`}>
        Dash
      </span>
    </motion.div>
  );

  if (variant === "icon") {
    return <LogoIcon />;
  }

  if (variant === "text") {
    return <LogoText />;
  }

  return (
    <div className="flex items-center space-x-3">
      <LogoIcon />
      <LogoText />
    </div>
  );
}