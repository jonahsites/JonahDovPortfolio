'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (triggerElement) gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax-scrolling" ref={parallaxRef}>
      <section className="parallax__header relative h-[150vh] overflow-hidden bg-black">
        <div className="parallax__visuals absolute inset-0">
          <div className="parallax__black-line-overflow absolute inset-0 z-50 pointer-events-none border-x-[10vw] border-black"></div>

          <div data-parallax-layers className="parallax__layers relative h-full w-full flex items-center justify-center">

            <img
              src="https://lh3.googleusercontent.com/d/1-48LO4-80eUwrifzfuZCNheJ3EMWFh4h"
              loading="eager"
              width="1200"
              data-parallax-layer="1"
              alt="Digital Frontier Archive"
              className="parallax__layer-img absolute w-full h-full object-cover opacity-40 grayscale"
              referrerPolicy="no-referrer"
            />

            <img
              src="https://lh3.googleusercontent.com/d/1ljHVC8mA3FYW9oNstJiPFSUh5aW55NCf"
              loading="eager"
              width="1000"
              data-parallax-layer="2"
              alt="Design Artifact 01"
              className="parallax__layer-img absolute w-3/4 h-3/4 object-contain opacity-60"
              referrerPolicy="no-referrer"
            />

            <div data-parallax-layer="3" className="parallax__layer-title relative z-20">
              <h2 className="parallax__title text-white font-display font-black text-7xl md:text-[12vw] uppercase tracking-tighter leading-none text-center">
                Digital <br /> <span className="text-brand-blue italic">Frontier</span>
              </h2>
            </div>

            <img
              src="https://lh3.googleusercontent.com/d/1vH3sjcUfVR7fdND5VMb_S7jrSVioz7jy"
              loading="eager"
              width="800"
              data-parallax-layer="4"
              alt="Design Artifact 02"
              className="parallax__layer-img absolute w-1/2 h-1/2 object-contain bottom-[-10%] right-[-5%] opacity-80 shadow-2xl"
              referrerPolicy="no-referrer"
            />

          </div>

          <div className="parallax__fade absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent z-30"></div>
        </div>
      </section>

      <section className="parallax__content bg-black py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none" className="osmo-icon-svg mx-auto mb-12 text-brand-blue">
            <path d="M80 0L98.5 61.5H160L111 99L129.5 160.5L80 123L30.5 160.5L49 99L0 61.5H61.5L80 0Z" fill="currentColor"></path>
          </svg>
          <p className="text-white/60 text-xl md:text-2xl font-medium tracking-wide leading-relaxed">
            Exploring the intersection of <span className="text-white">human intuition</span> and <span className="text-brand-blue">machine precision</span>. 
            Crafting digital experiences that transcend the ordinary.
          </p>
        </div>
      </section>
    </div>
  );
}
