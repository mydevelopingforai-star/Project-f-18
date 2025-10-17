"use client";

import React, { useEffect, useState } from "react";

const EMOJIS = ["🔥", "💨"];
const NUM_PARTICLES = 20;

type Particle = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
};

export function AnimatedParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < NUM_PARTICLES; i++) {
        newParticles.push({
          id: i,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          x: Math.random() * 100,
          y: Math.random() * 100 + 100, // Start below the viewport
          duration: Math.random() * 5 + 5, // 5 to 10 seconds
          delay: Math.random() * 5, // 0 to 5 seconds
          size: Math.random() * 1.5 + 0.5, // 0.5rem to 2rem
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}rem`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
