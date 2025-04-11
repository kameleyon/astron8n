
'use client';

import React, { useEffect, useRef } from 'react';

// Astrology symbols for planets and zodiac signs
const astrologySymbols = [
  '☉', // Sun
  '☽', // Moon
  '☿', // Mercury
  '♀', // Venus
  '♂', // Mars
  '♃', // Jupiter
  '♄', // Saturn
  '♅', // Uranus
  '♆', // Neptune
  '♇', // Pluto
  '♈', // Aries
  '♉', // Taurus
  '♊', // Gemini
  '♋', // Cancer
  '♌', // Leo
  '♍', // Virgo
  '♎', // Libra
  '♏', // Scorpio
  '♐', // Sagittarius
  '♑', // Capricorn
  '♒', // Aquarius
  '♓', // Pisces
  '✧', // Star
  '★', // Star filled
  '✦', // Star four pointed
  '⋆', // Star small
];

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  symbol: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

const AstrologyParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize particles when resizing
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize particles
    function initParticles() {
      const particles: Particle[] = [];
      const particleCount = Math.min(Math.max(Math.floor(window.innerWidth * window.innerHeight / 10000), 30), 100);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 20 + 10,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          symbol: astrologySymbols[Math.floor(Math.random() * astrologySymbols.length)],
          opacity: Math.random() * 0.5 + 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02
        });
      }
      
      particlesRef.current = particles;
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;
        
        // Wrap around edges
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
        
        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.font = `${particle.size}px Arial`;
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(particle.symbol, 0, 0);
        ctx.restore();
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ 
        background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
        opacity: 0.8
      }}
    />
  );
};

export default AstrologyParticles;
