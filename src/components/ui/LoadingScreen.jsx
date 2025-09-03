import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // nice spinner icon

export default function LoaderOne({ show }) {
  if (!show) return null; // only render when active

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        className="flex flex-col items-center gap-4 text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-lg font-medium">Loading, please wait...</p>
      </motion.div>
    </div>
  );
}
