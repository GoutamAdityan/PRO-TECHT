import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  return (
    <div
      onClick={toggleTheme}
      className={`flex items-center w-[64px] h-[36px] rounded-full p-[4px] cursor-pointer transition-colors duration-500 ease-in-out ${
        resolvedTheme === 'dark' ? 'bg-[#0F2417] justify-end' : 'bg-[#E6E6E6] justify-start'
      }`}
    >
      <motion.div
        layout
        transition={spring}
        className={`flex items-center justify-center w-[28px] h-[28px] rounded-full shadow-sm ${
          resolvedTheme === 'dark' ? 'bg-[#27C26C]' : 'bg-white'
        }`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-4 w-4 text-white" />
        ) : (
          <Sun className="h-4 w-4 text-gray-700" />
        )}
      </motion.div>
    </div>
  );
}
