"use client";

import { motion } from "motion/react";

const SplashScreen = () => (
  <div className="bg-background h-screen w-screen flex flex-col items-center justify-center gap-7 relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_70%)]" />
    </div>

    <motion.div
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.7,
        type: "spring",
        stiffness: 180,
        damping: 18,
      }}
      className="w-22 h-22 rounded-[22px] flex items-center justify-center"
      style={{
        width: 88,
        height: 88,
        background:
          "linear-gradient(145deg, #BFA071 0%, #9A7A4A 60%, #6B5030 100%)",
        boxShadow:
          "0 0 0 1px rgba(191,160,113,0.3), 0 8px 32px rgba(191,160,113,0.25), 0 0 60px rgba(191,160,113,0.12)",
      }}
    >
      <span className="text-background font-extrabold text-[40px] tracking-[-2px] leading-none">
        N
      </span>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-gold tracking-[5px] text-sm font-bold mb-1.5">
        NUMMUS
      </div>
      <div className="text-zinc-700 tracking-[3px] text-xs">
        FINANCIAL CONTROL ECOSYSTEM
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-4"
    >
      <div className="w-[120px] h-0.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.6, delay: 0.7, ease: "easeInOut" }}
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #BFA071, transparent)",
          }}
        />
      </div>
    </motion.div>
  </div>
);

export default SplashScreen;
