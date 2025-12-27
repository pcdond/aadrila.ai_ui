"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const products = [
  {
    id: 1,
    tag: "DocSim",
    title: "AI-Powered Document Similarity Engine",
    image: "/images/products/docsim.png",
    circle: "/images/backgrounds/right-circle.svg",
    reverse: false,
  },
  {
    id: 2,
    tag: "DocPilot",
    title: "Streamline Document Workflows with Automation",
    image: "/images/products/docpilot.png",
    circle: "/images/backgrounds/left-circle.svg",
    reverse: true,
  },
  {
    id: 3,
    tag: "Doxtract",
    title: "Extract, Validate, and Process Documents with Ease",
    image: "/images/products/doxtract.png",
    circle: "/images/backgrounds/right-circle.svg",
    reverse: true,
  },
];

export default function Products() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: any;

    const initGsap = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (dotRef.current) {
          gsap.from(dotRef.current, {
            x: -100,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }

        if (titleRef.current) {
          gsap.from(titleRef.current, {
            y: -60,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
            },
          });
        }

        productRefs.current.forEach((product) => {
          if (!product) return;

          const text = product.querySelector(".product-text");
          const image = product.querySelector(".product-image");
          const circle = product.querySelector(".product-circle");
          const reverse = product.classList.contains("reverse");

          if (text) {
            gsap.from(text, {
              x: reverse ? 120 : -120,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: product,
                start: "top 75%",
                once: true,
              },
            });
          }

          if (image || circle) {
            gsap.from([image, circle].filter(Boolean), {
              x: reverse ? -120 : 120,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: product,
                start: "top 75%",
                once: true,
              },
            });
          }
        });
      }, sectionRef);
    };

    initGsap();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white text-dark">
      {/* Dot box */}
      <div ref={dotRef} className="absolute left-10 top-10">
        <Image
          src="/images/backgrounds/dotsbox.svg"
          alt=""
          width={120}
          height={120}
        />
      </div>

      {/* Title */}
      <div ref={titleRef} className="text-center mb-40">
        <p className="text-secondary text-sm mb-2">features and benefits.</p>
        <h2 className="text-4xl font-semibold">Our Products</h2>
      </div>

      {/* Products */}
      <div className="space-y-[160px]">
        {products.map((product, index) => (
          <div
            key={product.id}
            ref={(el) => {
              productRefs.current[index] = el;
            }}
            className={`relative mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center ${
              product.reverse ? "reverse" : ""
            }`}
          >
            {/* Text */}
            <div className="product-text space-y-6">
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 text-sm">
                {product.tag}
              </span>

              <h3 className="text-3xl font-semibold">{product.title}</h3>

              <div className="flex gap-4">
                <button className="btn-primary">Learn More</button>
                <button className="btn-secondary">Schedule a Demo</button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="product-circle absolute inset-0 -z-10">
                <Image src={product.circle} alt="" width={600} height={600} />
              </div>

              <div className="product-image">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={520}
                  height={520}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
