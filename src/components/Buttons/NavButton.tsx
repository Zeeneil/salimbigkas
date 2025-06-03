import { motion } from "framer-motion";
import { JSX } from "react";

interface NavButtonProps {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  isActive?: boolean;
}

const NavButton = ({
  label,
  icon,
  onClick,
  isActive = false,
}: NavButtonProps) => (
  <motion.button
    className={`w-full py-1.5 px-3 rounded-lg ${
      isActive ? "bg-[#2C3E50] text-white" : "hover:bg-gray-100"
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileFocus={{
      scale: 1.05,
      backgroundColor: "#2C3E50",
      color: "#ffffff",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    }}
    whileTap={{ scale: 0.95 }}
    layout
  >
    <div className="relative flex items-center gap-3 px-15">
      <div className="absolute top-0 left-0">{icon}</div>
      <span className="whitespace-nowrap">{label}</span>
    </div>
  </motion.button>
);

export default NavButton;
