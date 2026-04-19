'use client';

import React from 'react';

export function ParallaxComponent() {
  return (
    <div className="parallax-scrolling">
      <section className="relative py-32 overflow-hidden bg-black border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="relative h-[600px] w-full flex flex-col items-center justify-center rounded-3xl overflow-hidden bg-white/5">
            <div className="absolute inset-0 z-0 opacity-20">
              <img
                src="https://lh3.googleusercontent.com/d/1-48LO4-80eUwrifzfuZCNheJ3EMWFh4h"
                alt="Digital Frontier Archive"
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="relative z-20 text-center px-4">
              <h2 className="text-white font-display font-black text-5xl md:text-8xl uppercase tracking-tighter leading-none">
                Creative <br /> <span className="text-brand-blue italic">Archive</span>
              </h2>
            </div>
            
            {/* Decoration images - static and better positioned */}
            <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 hidden md:block">
              <img
                src="https://lh3.googleusercontent.com/d/1ljHVC8mA3FYW9oNstJiPFSUh5aW55NCf"
                alt="Design Artifact 01"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="absolute bottom-10 right-10 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden md:block">
              <img
                src="https://lh3.googleusercontent.com/d/1vH3sjcUfVR7fdND5VMb_S7jrSVioz7jy"
                alt="Design Artifact 02"
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="parallax__content bg-black py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <img 
            src="https://image2url.com/r2/default/images/1774816200084-6e40dd72-bbb4-4e1b-ba4e-e8d06c7ed0a3.png" 
            alt="User Logo" 
            className="h-24 w-auto mx-auto mb-12 brightness-0 invert opacity-80"
            referrerPolicy="no-referrer"
          />
          <p className="text-white text-2xl md:text-4xl font-display font-black tracking-tighter uppercase leading-tight mb-6">
            Pioneering digital <span className="text-brand-blue">excellence</span> <br /> through meticulous design.
          </p>
          <div className="w-20 h-1 bg-brand-blue mx-auto mb-8" />
          <p className="text-white/40 text-sm md:text-base font-mono uppercase tracking-[0.3em] max-w-2xl mx-auto">
            Translating complex ideas into seamless user journeys since 2018.
          </p>
        </div>
      </section>
    </div>
  );
}
