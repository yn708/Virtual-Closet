'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const BackgroundSlider = () => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    scale: 1,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const screenHeight = window.innerHeight;
      const scale = screenHeight / 1080;
      const scaledWidth = 3840 * scale;
      setDimensions({
        width: scaledWidth,
        height: screenHeight,
        scale,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className="flex h-screen animate-slide"
        style={{ '--image-width': `${dimensions.width}px` } as React.CSSProperties}
      >
        {[1, 2].map((num) => (
          <div
            key={num}
            className="relative shrink-0"
            style={{
              width: `${dimensions.width}px`,
              height: '100vh',
            }}
          >
            <Image
              src="/images/fashion-bg.png"
              alt="Fashion items background"
              fill
              className="object-contains"
              priority
              sizes={`${dimensions.width}px`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSlider;
