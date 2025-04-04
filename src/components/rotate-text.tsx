import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function RotateText() {
  const words = ["Safe & Easy", "Secure", "Seamless", "Effortless"];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.h1
        key={words[index]}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className="text-left font-display text-4xl tracking-[-0.02em] drop-shadow-sm md:text-8xl md:leading-[5rem] bg-foreground p-4 text-background rounded-md items-center flex mx-4 -ml-1"
      >
        {words[index]}
      </motion.h1>
    </AnimatePresence>
  );
}
