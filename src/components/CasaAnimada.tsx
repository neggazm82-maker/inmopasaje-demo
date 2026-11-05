"use client";

import { motion } from "framer-motion";

/** Una casa que se "construye" por partes: suelo, paredes, tejado, puerta, ventanas y chimenea. */
export default function CasaAnimada() {
  const trazo = (delay: number, dur = 0.7) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { delay, duration: dur, ease: "easeInOut" as const }, opacity: { delay, duration: 0.01 } },
  });
  const aparece = (delay: number) => ({
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { delay, type: "spring" as const, stiffness: 260, damping: 16 },
  });
  return (
    <svg viewBox="0 0 240 200" className="mx-auto h-52 w-60" aria-hidden>
      {/* Sol de fondo */}
      <motion.circle cx="190" cy="48" r="22" fill="#DCEBFA" {...aparece(0)} />
      {/* Suelo */}
      <motion.path d="M20 178 H220" stroke="#A9CCEB" strokeWidth="6" strokeLinecap="round" fill="none" {...trazo(0.1, 0.5)} />
      {/* Ladrillos subiendo */}
      {[0, 1, 2, 3, 4].map((f) => (
        <motion.rect
          key={f}
          x="55" width="130" height="16" rx="2"
          y={160 - f * 16}
          fill={f % 2 ? "#DCEBFA" : "#FFFFFF"}
          stroke="#1F3A5F" strokeWidth="3"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          style={{ originY: 1 }}
          transition={{ delay: 0.5 + f * 0.18, duration: 0.25 }}
        />
      ))}
      {/* Tejado */}
      <motion.path d="M42 98 L120 40 L198 98 Z" fill="#F28C28" stroke="#1F3A5F" strokeWidth="4" strokeLinejoin="round"
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.5, type: "spring", stiffness: 120, damping: 12 }} />
      {/* Chimenea */}
      <motion.rect x="150" y="50" width="16" height="28" fill="#1F3A5F" {...aparece(2.0)} />
      {/* Puerta */}
      <motion.rect x="106" y="130" width="28" height="46" rx="3" fill="#1F3A5F" style={{ originY: 1 }}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 2.1, duration: 0.4 }} />
      <motion.circle cx="128" cy="154" r="2.5" fill="#F28C28" {...aparece(2.5)} />
      {/* Ventanas */}
      {[70, 148].map((x, k) => (
        <motion.g key={x} {...aparece(2.3 + k * 0.15)}>
          <rect x={x} y="114" width="24" height="24" rx="3" fill="#A9CCEB" stroke="#1F3A5F" strokeWidth="3" />
          <path d={`M${x + 12} 114 V138 M${x} 126 H${x + 24}`} stroke="#1F3A5F" strokeWidth="2" />
        </motion.g>
      ))}
      {/* Humo */}
      {[0, 1, 2].map((k) => (
        <motion.circle key={k} cx="158" cy="40" r={4 + k * 2} fill="#A9CCEB"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.8, 0], y: -30, x: k * 6 }}
          transition={{ delay: 2.8 + k * 0.4, duration: 2, repeat: Infinity, repeatDelay: 0.6 }} />
      ))}
      {/* Check final */}
      <motion.g {...aparece(3.0)}>
        <circle cx="52" cy="52" r="20" fill="#F28C28" />
        <motion.path d="M42 52 l7 7 l13 -14" stroke="#1F3A5F" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" {...trazo(3.2, 0.4)} />
      </motion.g>
    </svg>
  );
}
