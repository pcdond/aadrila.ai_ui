"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import Image from "next/image";

gsap.registerPlugin(Draggable);

const images = [
  "/images/carousels/hero/Doc.png",
  "/images/carousels/hero/Invoice.png",
  "/images/carousels/hero/License.png",
  "/images/carousels/hero/Doc.png",
  "/images/carousels/hero/Invoice.png",
  "/images/carousels/hero/License.png",
];

const AUTO_DELAY = 3;

const HeroCarousel = () => {
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const activeIndex = useRef(0);

  // ✅ FIXED TYPE
  const autoplayRef = useRef<gsap.core.Tween | null>(null);

  const dragProxy = useRef<HTMLDivElement | null>(null);
  const total = images.length;

  const normalizeOffset = (offset: number) => {
    if (offset > total / 2) return offset - total;
    if (offset < -total / 2) return offset + total;
    return offset;
  };

  const render = () => {
    slidesRef.current.forEach((slide, i) => {
      gsap.killTweensOf(slide);

      const offset = normalizeOffset(i - activeIndex.current);

      if (offset === 0) {
        gsap.to(slide, {
          xPercent: 0,
          z: 0,
          rotationY: 0,
          autoAlpha: 1,
          zIndex: 10,
          duration: 0.8,
          ease: "expo.out",
        });
      } else if (offset === -1) {
        gsap.to(slide, {
          xPercent: -95,
          z: -300,
          rotationY: 45,
          autoAlpha: 1,
          zIndex: 5,
          duration: 0.8,
          ease: "expo.out",
        });
      } else if (offset === 1) {
        gsap.to(slide, {
          xPercent: 95,
          z: -300,
          rotationY: -45,
          autoAlpha: 1,
          zIndex: 5,
          duration: 0.8,
          ease: "expo.out",
        });
      } else {
        gsap.to(slide, {
          xPercent: offset > 0 ? 150 : -150,
          z: -600,
          autoAlpha: 0,
          zIndex: 0,
          duration: 0.8,
          ease: "expo.out",
        });
      }
    });
  };

  const next = () => {
    activeIndex.current = (activeIndex.current + 1) % total;
    render();
  };

  const startAutoplay = () => {
    autoplayRef.current?.kill();

    autoplayRef.current = gsap.delayedCall(AUTO_DELAY, function loop() {
      next();
      autoplayRef.current = gsap.delayedCall(AUTO_DELAY, loop);
    });
  };

  useEffect(() => {
    render();
    startAutoplay();

    if (dragProxy.current) {
      Draggable.create(dragProxy.current, {
        type: "x",
        onPress() {
          autoplayRef.current?.kill();
        },
        onDragEnd() {
          if (this.getDirection() === "left") {
            next();
          } else {
            activeIndex.current = (activeIndex.current - 1 + total) % total;
            render();
          }
          startAutoplay();
        },
      });
    }

    return () => {
      autoplayRef.current?.kill();
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      {/* Drag proxy */}
      <div ref={dragProxy} className="absolute inset-0 z-50 cursor-grab" />

      <div
        className="relative h-[280px] w-72 md:h-[360px] md:w-80 perspective-[1200px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) slidesRef.current[i] = el;
            }}
            className="absolute inset-0 rounded-2xl border border-white/10 shadow-2xl"
          >
            <Image
              src={src}
              alt={`Slide ${i}`}
              fill
              className="pointer-events-none rounded-2xl object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
