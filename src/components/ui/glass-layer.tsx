'use client';

import React, {useEffect, useRef} from 'react';

const GlassLayer: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });
  const current = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });
  const animationFrame = useRef<number>();

  useEffect(() => {
    const moveGlow = (e: MouseEvent | TouchEvent) => {
      let x = 0,
        y = 0;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
      }
      target.current = {x, y};
      showGlow();
    };

    const hideGlow = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
      }
    };

    const showGlow = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = '1';
      }
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      if (glowRef.current) {
        glowRef.current.style.left = `${current.current.x}px`;
        glowRef.current.style.top = `${current.current.y}px`;
      }
      animationFrame.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', moveGlow);
    window.addEventListener('touchmove', moveGlow);
    document.addEventListener('mouseleave', hideGlow);
    window.addEventListener('mouseenter', showGlow);
    window.addEventListener('touchend', hideGlow);
    window.addEventListener('touchcancel', hideGlow);
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', moveGlow);
      window.removeEventListener('touchmove', moveGlow);
      document.removeEventListener('mouseleave', hideGlow);
      window.removeEventListener('mouseenter', showGlow);
      window.removeEventListener('touchend', hideGlow);
      window.removeEventListener('touchcancel', hideGlow);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <div className="glass-layer">
      <div ref={glowRef} className="glass-glow" />
    </div>
  );
};

export {GlassLayer};
