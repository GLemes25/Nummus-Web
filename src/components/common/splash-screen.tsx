"use client";

import { motion } from "motion/react";
import Image from "next/image";

const SplashScreen = () => (
  <div className="bg-background h-screen w-screen flex flex-col items-center justify-center gap-7 relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_70%)]" />
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
      className="w-50 h-50 rounded-[22px] flex items-center justify-center "
      style={{
        width: 120,
        height: 120,
        backgroundColor: "#000",
        boxShadow:
          "0 0 0 1px rgba(191,160,113,0.3), 0 8px 32px rgba(191,160,113,0.25), 0 0 60px rgba(191,160,113,0.12)",
      }}
    >
      <Image src="/Icon_square.png" alt="Logo" width={300} height={300} />
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
        ECOSSISTEMA DE CONTROLE FINANCEIRO
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-4"
    >
      <div className="w-30 h-0.5 bg-muted rounded-full overflow-hidden">
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
