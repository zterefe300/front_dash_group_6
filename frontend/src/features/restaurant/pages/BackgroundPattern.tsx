import { motion } from "motion/react";

interface BackgroundPatternProps {
  variant?: "dots" | "grid" | "waves" | "food";
  opacity?: number;
}

export function BackgroundPattern({ variant = "dots", opacity = 0.1 }: BackgroundPatternProps) {
  if (variant === "dots") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity }}
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity }}
        >
          <defs>
            <pattern
              id="grid"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.svg
          className="absolute -top-10 -right-10 w-96 h-96"
          style={{ opacity }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 200 200"
        >
          <path
            d="M 0,100 C 50,50 100,150 200,100 L 200,200 L 0,200 Z"
            fill="currentColor"
            className="text-primary"
          />
        </motion.svg>
        
        <motion.svg
          className="absolute -bottom-10 -left-10 w-96 h-96"
          style={{ opacity: opacity * 0.7 }}
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 200 200"
        >
          <path
            d="M 200,100 C 150,150 100,50 0,100 L 0,0 L 200,0 Z"
            fill="currentColor"
            className="text-secondary"
          />
        </motion.svg>
      </div>
    );
  }

  if (variant === "food") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10"
          style={{ opacity: opacity * 0.5 }}
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FoodIcon type="pizza" size={40} />
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20"
          style={{ opacity: opacity * 0.6 }}
          initial={{ y: 0 }}
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <FoodIcon type="burger" size={35} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-32 left-20"
          style={{ opacity: opacity * 0.4 }}
          initial={{ y: 0 }}
          animate={{ y: [-5, 15, -5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <FoodIcon type="coffee" size={30} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-10"
          style={{ opacity: opacity * 0.5 }}
          initial={{ y: 0 }}
          animate={{ y: [8, -12, 8] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <FoodIcon type="salad" size={38} />
        </motion.div>
      </div>
    );
  }

  return null;
}

interface FoodIconProps {
  type: "pizza" | "burger" | "coffee" | "salad";
  size: number;
}

function FoodIcon({ type, size }: FoodIconProps) {
  const iconProps = {
    width: size,
    height: size,
    fill: "currentColor",
    className: "text-primary"
  };

  if (type === "pizza") {
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M12 2L13.09 8.26L19 7L14.74 13.75L20 15L12 22L10.91 15.74L5 17L9.26 10.25L4 9L12 2Z" />
      </svg>
    );
  }

  if (type === "burger") {
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M12 2C7.58 2 4 5.58 4 10C4 10.5 4.06 11 4.17 11.5H19.83C19.94 11 20 10.5 20 10C20 5.58 16.42 2 12 2ZM4.5 13C4.22 13 4 13.22 4 13.5S4.22 14 4.5 14H19.5C19.78 14 20 13.78 20 13.5S19.78 13 19.5 13H4.5ZM4.17 16.5C4.06 17 4 17.5 4 18C4 20.21 5.79 22 8 22H16C18.21 22 20 20.21 20 18C20 17.5 19.94 17 19.83 16.5H4.17Z" />
      </svg>
    );
  }

  if (type === "coffee") {
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M2 21V19H20V21H2M20 8V5L18 5V8H20M20 3C21.1 3 22 3.9 22 5V8C22 9.1 21.1 10 20 10H18V13C18 14.1 17.1 15 16 15H8C6.9 15 6 14.1 6 13V4C6 2.9 6.9 2 8 2H16C17.1 2 18 2.9 18 4V8H20V3Z" />
      </svg>
    );
  }

  if (type === "salad") {
    return (
      <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M17.43 10.83C17.78 10.83 18.06 11.11 18.06 11.46C18.06 11.81 17.78 12.09 17.43 12.09C17.08 12.09 16.8 11.81 16.8 11.46C16.8 11.11 17.08 10.83 17.43 10.83M5.86 10.67C6.21 10.67 6.49 10.95 6.49 11.3C6.49 11.65 6.21 11.93 5.86 11.93C5.51 11.93 5.23 11.65 5.23 11.3C5.23 10.95 5.51 10.67 5.86 10.67M16.32 15.33C14.25 14.63 12.38 13.58 10.79 12.23C9.14 13.62 7.17 14.7 5 15.4C6.03 16.78 7.61 17.68 9.39 17.91C11.17 18.14 12.97 17.68 14.39 16.63C15.14 16.1 15.78 15.75 16.32 15.33M16.97 8.5C15.5 9.31 14.22 10.39 13.18 11.67C14.96 12.29 16.89 12.54 18.83 12.4C18.83 10.67 18.1 9.43 16.97 8.5Z" />
      </svg>
    );
  }

  return null;
}
