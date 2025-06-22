import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
  const router = useRouter();

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        router.back();
      }}
      type="button"
      className="text-sm text-blue-600 font-medium mb-2 cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
      whileHover={{
        x: -5,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        animate={{ x: [0, -2, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
      >
        <ArrowLeft className="h-4 w-4" />
      </motion.div>
      Back
    </motion.button>
  );
};

export default BackButton;
