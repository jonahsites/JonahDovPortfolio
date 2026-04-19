import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValueEvent, AnimatePresence, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Github, Instagram, Twitter, Youtube, Menu, X, ChevronDown, ArrowLeft, ArrowRight, Users } from 'lucide-react';
import Lenis from 'lenis';
import { cn } from '@/src/lib/utils';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

import { Parallax, ParallaxItem, PrallaxContainer } from './components/ui/parallax';
import { StaggerText } from './components/ui/stagger-text';
import { Button } from './components/ui/button';
import { ParallaxComponent } from './components/ui/parallax-scrolling';

// --- Scroll To Top Component ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Components ---

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="liquid-glass rounded-full p-2 flex justify-between items-center">
        <div className="flex-1 flex justify-center">
          <Link to="/" className="px-6 py-2 border border-brand-blue/50 text-white hover:bg-brand-blue transition-all duration-300 text-[10px] font-mono uppercase tracking-widest">Home</Link>
        </div>
        <div className="flex-1 flex justify-center">
          <Link to="/about" className="px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 text-[10px] font-mono uppercase tracking-widest">About</Link>
        </div>
        <div className="flex-1 flex justify-center">
          <Link to="/" className="flex items-center justify-center group">
            <img 
              src="https://image2url.com/r2/default/images/1774816200084-6e40dd72-bbb4-4e1b-ba4e-e8d06c7ed0a3.png" 
              alt="Logo" 
              className="h-8 w-auto brightness-0 invert opacity-50 group-hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <Link to="/work" className="px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 text-[10px] font-mono uppercase tracking-widest">Work</Link>
        </div>
        <div className="flex-1 flex justify-center">
          {isHomePage ? (
            <a href="#contact" className="px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 text-[10px] font-mono uppercase tracking-widest">Contact</a>
          ) : (
            <Link to="/#contact" className="px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 text-[10px] font-mono uppercase tracking-widest">Contact</Link>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sketchfab Viewer Component ---
const SketchfabViewer = ({ scrollProgress }: { scrollProgress: any }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const client = new (window as any).Sketchfab('1.12.1', iframeRef.current);

    client.init('df53023f7a53495c8beb282c9a38bc08', {
      success: (api: any) => {
        api.start();
        api.addEventListener('viewerready', () => {
          apiRef.current = api;
        });
      },
      error: () => {
        console.error('Sketchfab API error');
      },
      autostart: 1,
      preload: 1,
      transparent: 1,
      ui_hint: 0,
      ui_controls: 0,
      ui_animations: 0,
      ui_annotations: 0,
      ui_settings: 0,
      ui_help: 0,
      ui_vr: 0,
      ui_fullscreen: 0,
      ui_inspector: 0,
      scrollwheel: 0,
      double_click: 0,
      click_to_retry: 1,
      navigation: 0 // Disable manual rotation/panning
    });
  }, []);

  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (apiRef.current) {
      const val = latest as any as number;
      const scrollRotation = val * Math.PI * 2;
      const radius = 7.5; 
      const eyeX = Math.sin(scrollRotation) * radius;
      const eyeY = Math.cos(scrollRotation) * radius;
      const eyeZ = 1.2;
      apiRef.current.setCameraLookAt([eyeX, eyeY, eyeZ], [0, 0, 0], 0);
    }
  });

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-[-10%] w-[120%] h-[120%] pointer-events-none">
        <iframe
          ref={iframeRef}
          title="Sketchfab Model"
          className="w-full h-full border-0" 
          allow="autoplay; fullscreen; xr-spatial-tracking"
        />
      </div>
    </div>
  );
};

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const modelScale = useTransform(smoothProgress, [0, 0.8], [1, 2.5]); 
  const textScale = useTransform(smoothProgress, [0, 0.8], [1, 1.5]);
  const contentScale = useTransform(smoothProgress, [0, 0.6], [1, 1.2]);
  const contentOpacity = useTransform(smoothProgress, [0.6, 0.8], [1, 0]);
  
  const starScale = useTransform(smoothProgress, [0, 1], [1, 15]);
  const starOpacity = useTransform(smoothProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);

  const stars = [
    { top: '15%', left: '10%' },
    { top: '20%', left: '85%' },
    { top: '75%', left: '15%' },
    { top: '80%', left: '80%' },
    { top: '45%', left: '5%' },
    { top: '35%', left: '95%' },
    { top: '10%', left: '40%' },
    { top: '60%', left: '90%' },
    { top: '30%', left: '20%' },
    { top: '90%', left: '50%' },
    { top: '50%', left: '10%' },
  ];

  return (
    <section ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="relative w-full max-w-7xl h-full flex flex-col items-center justify-center px-6"
        >
          {/* Floating Stars */}
          {stars.map((star, i) => (
            <motion.img
              key={i}
              src="https://pngimg.com/d/star_PNG76911.png"
              alt="Star"
              referrerPolicy="no-referrer"
              style={{ 
                top: star.top, 
                left: star.left,
                scale: starScale,
                opacity: starOpacity
              }}
              className="absolute w-8 h-8 z-5 pointer-events-none brightness-150 contrast-125 blur-[0.5px] transform-gpu"
            />
          ))}

          {/* Big Text Background */}
          <motion.div 
            style={{ scale: textScale }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0"
          >
            <h1 className="text-[35vw] font-display text-white leading-none tracking-[-0.08em] opacity-10 font-black">
              DOV
            </h1>
          </motion.div>

          {/* Sketchfab Model Overlay */}
          <div className="absolute inset-0 z-10">
            <motion.div 
              style={{ scale: modelScale }}
              className="w-full h-full flex items-center justify-center origin-center"
            >
              <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/20">Loading 3D Experience...</div>}>
                <SketchfabViewer scrollProgress={smoothProgress} />
              </React.Suspense>
            </motion.div>
          </div>

          {/* Content Overlays */}
          <motion.div 
            style={{ scale: contentScale, opacity: contentOpacity }}
            className="absolute inset-0 z-20 pt-32 pb-12 px-12 flex flex-col justify-between pointer-events-none"
          >
            <div className="flex justify-between items-start">
              <div className="max-w-xs pointer-events-auto">
                <h2 className="text-white font-display text-4xl mb-4 tracking-tighter font-black uppercase">Jonah D</h2>
                <p className="text-white/80 text-xs leading-relaxed font-medium tracking-wide">
                  Creating interfaces that blend function with emotion, crafting digital experiences that feel intuitive, seamless, and meaningful.
                </p>
                <div className="flex gap-3 mt-6">
                  <a 
                    href="https://www.instagram.com/graphics_by_jd/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-end">
              <div className="max-w-xs text-right pointer-events-auto">
                <p className="text-white/80 text-xs leading-relaxed mb-8 font-medium tracking-wide">
                  Merging design thinking with human insight to create digital experiences that don't just look great — they perform effortlessly.
                </p>
                <button className="px-10 py-4 border border-white text-white font-mono text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 ml-auto hover:bg-white hover:text-black transition-all duration-500 group">
                  Let's Talk <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ project: any; index: number }> = ({ project, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const ButtonContent = () => (
    <>
      <span className="font-mono text-[10px] uppercase tracking-[0.4em]">
        {project.link ? "View Projects" : "View Case Study"}
      </span>
      <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
    </>
  );

  return (
    <motion.div 
      ref={ref}
      style={{ scale }}
      className={cn(
        "relative w-full min-h-[80vh] flex items-center mb-32",
        index % 2 === 0 ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "w-full md:w-3/4 relative group",
        index % 2 === 0 ? "md:pr-20" : "md:pl-20"
      )}>
        <motion.div 
          style={{ y }}
          className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
        >
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10 p-8 md:p-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl max-w-md shadow-2xl",
          index % 2 === 0 ? "right-0 md:-right-10" : "left-0 md:-left-10"
        )}>
          <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em] mb-4">{project.category}</p>
          <h3 className="text-3xl md:text-4xl font-display font-black mb-4 text-white tracking-tighter">{project.title}</h3>
          <p className="text-white/60 mb-8 leading-relaxed text-sm font-medium">{project.description}</p>
          
          {project.link ? (
            <Link to={project.link} className="inline-flex items-center gap-4 px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 group">
              <ButtonContent />
            </Link>
          ) : (
            <button className="inline-flex items-center gap-4 px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 group">
              <ButtonContent />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const WorkSection = () => {
  const projects = [
    {
      title: "Website Designer",
      category: "Digital Architecture",
      description: "Crafting high-performance, immersive web experiences that blend cutting-edge technology with intuitive user journeys.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fmunozzz.vercel.app%2F?w=1200&h=800",
      link: "/work/websites"
    },
    {
      title: "Logo Designer",
      category: "Brand Identity",
      description: "Distilling complex brand stories into iconic, timeless visual marks that command attention and build lasting recognition.",
      image: "/MomLogo.png",
      link: "/work/logos"
    },
    {
      title: "Graphic Designer",
      category: "Visual Storytelling",
      description: "Creating compelling visual narratives across digital and print media, focusing on composition, typography, and color theory.",
      image: "https://lh3.googleusercontent.com/d/1ljHVC8mA3FYW9oNstJiPFSUh5aW55NCf",
      link: "/work/graphics"
    }
  ];

  return (
    <section id="work" className="py-32 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="mb-24">
          <h2 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.5em] mb-4">Selected Works</h2>
          <p className="text-5xl md:text-7xl font-display font-black tracking-tighter max-w-3xl text-white uppercase">
            Blending precision with <span className="text-white/30 italic">creative soul.</span>
          </p>
        </div>

        <div className="flex flex-col">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 bg-transparent overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div ref={ref} className="relative z-10 rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl">
          <img 
            src="https://files.catbox.moe/m5dird.png" 
            alt="Profile"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div>
          <h2 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.5em] mb-6">The Designer</h2>
          <h3 className="text-4xl md:text-6xl font-display font-black mb-8 tracking-tighter text-white uppercase">
            Jonah <br /> D.
          </h3>
          <p className="text-white/80 text-sm leading-relaxed font-medium tracking-wide mb-8">
            I started 4 years ago experimenting with Photoshop, which quickly grew into a passion for sports graphics. From there, I transitioned into logo design and launched a business for local sports trainers. Today, I've expanded into building high-performance websites, blending my creative roots with modern digital solutions.
          </p>
          
          <Link to="/about" className="inline-flex items-center gap-4 px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 group">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Read Full Story</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section id="contact" className="py-32 bg-transparent text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#0066FF,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.5em] mb-8">Get in Touch</h2>
          <p className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-12 uppercase">
            Let's build something <br /> <span className="text-brand-blue">extraordinary.</span>
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-20">
            <a href="mailto:jadovdav@gmail.com" className="text-2xl md:text-4xl font-light hover:text-brand-blue transition-colors">
              jadovdav@gmail.com
            </a>
            <div className="hidden md:block w-2 h-2 rounded-full bg-brand-blue" />
            <p className="text-2xl md:text-4xl font-light">+1 (973) 275-7624</p>
          </div>

          <button className="px-12 py-6 border border-white text-white font-mono text-xs uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500 flex items-center gap-4 mx-auto group">
            Start a Project <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>

        <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <img 
              src="https://image2url.com/r2/default/images/1774816200084-6e40dd72-bbb4-4e1b-ba4e-e8d06c7ed0a3.png" 
              alt="Logo" 
              className="h-8 w-auto brightness-0 invert"
              referrerPolicy="no-referrer"
            />
            <p className="text-sm text-white/40">© 2026 A Dove's Purpose. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            {['Instagram'].map((social) => (
              <a 
                key={social} 
                href="https://www.instagram.com/graphics_by_jd/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-20"
    >
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-start mb-32">
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl"
            >
              <img 
                src="https://files.catbox.moe/m5dird.png" 
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-blue/10 rounded-full blur-3xl" />
          </div>

          <div>
            <h2 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.5em] mb-6">About Me</h2>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-white uppercase mb-12">
              Jonah <span className="text-brand-blue">D.</span>
            </h1>
            
            <div className="space-y-8 text-white/70 text-lg leading-relaxed font-medium">
              <p>
                I started 4 years ago experimenting with Photoshop, which quickly grew into a passion for sports graphics. What began as a hobby soon turned into something much larger as I found my rhythm in the digital design space.
              </p>
              <p>
                From sports graphics, I transitioned into logo design and launched a dedicated business creating visual identities for local sports trainers. This experience taught me the power of branding and the importance of professional digital assets for growing businesses.
              </p>
              <p>
                Today, I’ve expanded my expertise into building performance-driven websites. I combine my foundations in graphic design and branding with modern web technology to create immersive digital experiences that truly resonate with users.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-16 border-t border-white/10 pt-16">
              <div>
                <p className="text-5xl font-display font-bold text-white">120+</p>
                <p className="text-sm text-white/40 uppercase tracking-widest mt-2">Projects Done</p>
              </div>
              <div>
                <p className="text-5xl font-display font-bold text-white">4+</p>
                <p className="text-sm text-white/40 uppercase tracking-widest mt-2">Awards Won</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stable Archive Section - Showing only REX Soccer */}
        <div className="mb-32 py-20 border-y border-white/5">
          <div className="text-center mb-16 px-6">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase mb-6 text-white">
              Engineering digital experiences <br /> <span className="text-brand-blue italic">that define the future</span>
            </h2>
            <p className="max-w-prose mx-auto text-white/60 text-lg font-medium leading-relaxed mb-12">
              Defining the intersection of technical excellence and visual storytelling. 
              Creating digital identities that resonate with the next generation of users.
            </p>
            <Link to="/work/websites">
              <Button className="bg-brand-blue hover:bg-brand-blue/80 text-white font-mono text-[10px] uppercase tracking-[0.3em] px-12 py-6 rounded-none border border-white/10" size="lg">
                Explore the Archive
              </Button>
            </Link>
          </div>

          <div className="flex justify-center px-6">
            <div className="aspect-[3/4] max-w-sm w-full">
              <img
                className="size-full object-cover rounded-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-500"
                src="https://s0.wp.com/mshots/v1/https%3A%2F%2Frex-soccer-training.vercel.app%2F?w=1200&h=800"
                alt="REX Soccer"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="mb-32">
          <h2 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.5em] mb-12 text-center">My Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['UI/UX Design', '3D Animation', 'Frontend Dev', 'Brand Identity', 'Motion Graphics', 'Product Strategy', 'Web3 Design', 'Creative Coding'].map((skill, i) => (
              <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-colors">
                <p className="text-white font-bold uppercase text-xs tracking-widest">{skill}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-4 px-8 py-4 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 font-mono text-[10px] uppercase tracking-[0.4em]">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const WorkPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-20"
    >
      <div className="container mx-auto px-6">
        <div className="mb-24 text-center">
          <h2 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.5em] mb-4">Portfolio</h2>
          <h1 className="text-6xl md:text-9xl font-display font-black tracking-tighter text-white uppercase mb-8">
            My <span className="text-brand-blue">Work</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium tracking-wide">
            A curated selection of projects where I've pushed the boundaries of digital design and development.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-20">
          <Link to="/work/websites" className="px-8 py-3 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 font-mono text-[10px] uppercase tracking-widest">Websites</Link>
          <Link to="/work/logos" className="px-8 py-3 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 font-mono text-[10px] uppercase tracking-widest">Logos</Link>
          <Link to="/work/graphics" className="px-8 py-3 border border-brand-blue text-white bg-brand-blue/10 hover:bg-brand-blue transition-all duration-300 font-mono text-[10px] uppercase tracking-widest">Graphics</Link>
        </div>
        
        <WorkSection />
        
        <div className="mt-20 text-center">
          <Link to="/" className="inline-flex items-center gap-4 px-8 py-4 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 font-mono text-[10px] uppercase tracking-[0.4em]">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const FoldingLetter = ({ char, progress, range, index, totalLetters }: { char: string; progress: any; range: [number, number]; index: number; totalLetters: number }) => {
  const slices = 8;
  const [start, end] = range;
  
  // Staggering and duration constants
  const stagger = 0.02;
  const sliceStagger = 0.01;
  const duration = 0.12;

  return (
    <div className="relative w-[10vw] h-[15vw] md:w-[8vw] md:h-[12vw] perspective-[2000px]">
      {Array.from({ length: slices }).map((_, i) => {
        const sliceHeight = 100 / slices;
        const top = i * sliceHeight;
        const bottom = (i + 1) * sliceHeight;
        
        // Timing points
        const u0 = Math.max(0, start - 0.02); 
        const u1 = Math.min(1, start + (index * stagger) + (i * sliceStagger));
        const u2 = Math.min(1, u1 + duration);
        const f1 = Math.min(1, Math.max(u2, end + (index * stagger) + (i * sliceStagger)));
        const f2 = Math.min(1, f1 + duration);

        // Ensure strictly non-decreasing
        const mainRange = [u0, u1, u2, f1, f2];
        for (let j = 1; j < mainRange.length; j++) {
          if (mainRange[j] < mainRange[j-1]) mainRange[j] = mainRange[j-1];
        }

        // Visibility range
        const visibleStart = Math.max(0, u0 - 0.01);
        const visibleEnd = Math.min(1, f2 + 0.15);
        const visibilityRange = [visibleStart, u0, f2, visibleEnd];
        for (let j = 1; j < visibilityRange.length; j++) {
          if (visibilityRange[j] < visibilityRange[j-1]) visibilityRange[j] = visibilityRange[j-1];
        }

        // Rotation
        const rotateX = useTransform(progress, mainRange, [90, 25, 0, 0, -110]);
        
        // Z-depth
        const z = useTransform(progress, mainRange, [-120, -80, 0, 0, -150]);
        
        // Opacity
        const opacity = useTransform(progress, visibilityRange, [0, 1, 1, 0]);

        // Shadow Overlay Opacity
        const shadowOpacity = useTransform(progress, mainRange, [0.8, 0.4, 0, 0, 0.7]);

        return (
          <motion.div
            key={i}
            style={{ 
              rotateX,
              z,
              opacity,
              transformOrigin: "bottom",
              zIndex: slices - i,
              willChange: "transform, opacity"
            }}
            className="absolute inset-0 flex items-center justify-center backface-hidden transform-gpu"
          >
             <span 
                className="text-[12vw] md:text-[10vw] font-display font-black leading-none text-white select-none relative"
                style={{
                  clipPath: `polygon(0% ${top}%, 100% ${top}%, 100% ${bottom}%, 0% ${bottom}%)`,
                }}
              >
                {char}
                <motion.div 
                  style={{ opacity: shadowOpacity }}
                  className="absolute inset-0 bg-black pointer-events-none"
                />
              </span>
          </motion.div>
        );
      })}
    </div>
  );
};

const FoldingSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const words = [
    { text: "WEBSITES", range: [0.1, 0.4] as [number, number], link: "/work/websites" },
    { text: "LOGOS", range: [0.45, 0.7] as [number, number] },
    { text: "GRAPHICS", range: [0.75, 0.98] as [number, number], link: "/work/graphics" }
  ];

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-transparent">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="mb-12 text-center">
          <h2 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.5em] mb-4">The Craft</h2>
          <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">Scroll to flip through the services — Click to explore</p>
        </div>
        
        <div className="relative w-full flex items-center justify-center">
          {words.map((wordObj, wordIdx) => {
            // Broad opacity range to allow overlapping visibility
            const startFadeIn = wordObj.range[0] - 0.05; // Wait for previous word to start folding
            const endFadeIn = wordObj.range[0];
            const startFadeOut = wordObj.range[1] + 0.1;
            const endFadeOut = wordObj.range[1] + 0.2;

            const wordOpacity = useTransform(
              smoothProgress,
              [startFadeIn, endFadeIn, startFadeOut, endFadeOut],
              [0, 1, 1, 0]
            );

            const pointerEvents = useTransform(wordOpacity, (v) => v > 0.5 ? "auto" : "none");

            const Content = () => (
              <motion.div 
                style={{ 
                  opacity: wordOpacity,
                  zIndex: words.length - wordIdx,
                  pointerEvents 
                }}
                className="absolute inset-0 flex items-center justify-center gap-1 md:gap-3 cursor-pointer group/word"
              >
                {wordObj.text.split("").map((char, i) => (
                  <FoldingLetter 
                    key={i} 
                    char={char} 
                    progress={smoothProgress} 
                    range={wordObj.range} 
                    index={i}
                    totalLetters={wordObj.text.length}
                  />
                ))}
              </motion.div>
            );

            return wordObj.link ? (
              <Link key={wordIdx} to={wordObj.link}>
                <Content />
              </Link>
            ) : (
              <Content key={wordIdx} />
            );
          })}
          {/* Placeholder for height to maintain layout */}
          <div className="invisible flex gap-1 md:gap-3">
             {"GRAPHICS".split("").map((_, i) => (
               <div key={i} className="w-[10vw] h-[15vw] md:w-[8vw] md:h-[12vw]" />
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const WebsiteCard = ({ site, index }: { site: any; index: number }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity, rotateX: rotate }}
      className="relative mb-32 last:mb-0 group perspective-[1000px]"
    >
      <div className={cn(
        "flex flex-col md:flex-row items-center gap-12",
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}>
        {/* Image Container with Parallax */}
        <div className="w-full md:w-3/5 relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
          <motion.div style={{ y }} className="absolute inset-0">
            <img 
              src={site.image} 
              alt={site.name}
              className="w-full h-full object-cover scale-125"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Floating Badge */}
          <div className="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">0{index + 1}</p>
          </div>
        </div>

        {/* Content Container */}
        <div className={cn(
          "w-full md:w-2/5",
          index % 2 === 0 ? "text-left" : "text-right md:text-right"
        )}>
          <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-4xl md:text-6xl font-display font-black text-white mb-6 uppercase tracking-tighter leading-none">
              {site.name.split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 1 ? "text-brand-blue block" : "block"}>{word}</span>
              ))}
            </h3>
            <p className="text-white/60 text-lg mb-8 font-medium leading-relaxed max-w-md ml-auto mr-auto md:ml-0 md:mr-0">
              {site.description}
            </p>
            <a 
              href={site.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-6 px-10 py-5 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 group/link",
                index % 2 !== 0 && "flex-row-reverse"
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Explore Project</span>
              <ArrowUpRight size={18} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const WebsitesPage = () => {
  const websites = [
    {
      name: "Munozzz",
      url: "https://munozzz.vercel.app/",
      description: "A premium lifestyle and fashion platform featuring curated collections and high-end brand identity.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fmunozzz.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "YOLO Boat",
      url: "https://yolo-boat.vercel.app/",
      description: "Luxury boat rental and adventure platform designed for seamless booking and elite maritime experiences.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fyolo-boat.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "REX Soccer",
      url: "https://rex-soccer-training.vercel.app/",
      description: "Professional soccer training programs and scheduling. Built with a focus on high-performance athletes and seamless booking.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Frex-soccer-training.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "Ania Candles",
      url: "https://ania-candles.vercel.app/",
      description: "Elegant e-commerce store dedicated to artisanal, handcrafted candles with a focus on minimalist design.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fania-candles.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "Bundricks Lawn",
      url: "https://bundricks-lawn.vercel.app/",
      description: "Modern landing page for professional lawn care services, highlighting reliability and high-quality landscaping.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fbundricks-lawn.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "Kings",
      url: "https://kings-ruddy-alpha.vercel.app/",
      description: "A bold, high-impact web presence for the Kings brand, featuring immersive visuals and performance-driven design.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fkings-ruddy-alpha.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "Phoenix Plumber",
      url: "https://the-phoenix-plumber.vercel.app/",
      description: "High-conversion service architecture for plumbing professionals, optimized for mobile performance and user trust.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fthe-phoenix-plumber.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "Cage Raised",
      url: "https://cage-raised.vercel.app/",
      description: "Digital hub for the Cage Raised community, blending raw aesthetics with functional social features.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fcage-raised.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "BIHM Baseball",
      url: "https://bihm-baseball.vercel.app/",
      description: "Advanced data-driven training platform for elite baseball players, tracking progress and performance metrics.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fbihm-baseball.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "Hack House",
      url: "https://hack-house-seven.vercel.app/",
      description: "A collaborative space for developers and innovators. A digital hub designed to foster creativity and technical excellence.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fhack-house-seven.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "Do It Once",
      url: "https://do-it-once.vercel.app/",
      description: "Modern service website for professional plumbing solutions. Clean, efficient, and built to convert visitors into customers.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fdo-it-once.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "724 Baseball",
      url: "https://724-baseball-nwc6.vercel.app/",
      description: "A comprehensive platform for baseball training and statistics, featuring real-time data visualization and player tracking.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2F724-baseball-nwc6.vercel.app%2F?w=1200&h=800"
    },
    {
      name: "Power Painting",
      url: "https://power-painting.vercel.app/",
      description: "A professional-grade web experience for commercial and residential painting services, focusing on craftsmanship and visual impact.",
      image: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fpower-painting.vercel.app%2F?w=1200&h=800"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-40 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.5em] mb-6">Digital Showcase</h2>
            <h1 className="text-7xl md:text-[12vw] font-display font-black tracking-tighter text-white uppercase mb-12 leading-[0.85]">
              Web<span className="text-brand-blue italic">sites</span>
            </h1>
            <p className="text-white/40 text-xl max-w-3xl mx-auto font-medium tracking-wide leading-relaxed">
              Pushing the boundaries of what's possible on the web. Each project is a unique blend of <span className="text-white">innovation, performance, and creative soul.</span>
            </p>
          </motion.div>
        </div>

        <div className="space-y-64">
          {websites.filter(s => s.name === "REX Soccer").map((site, index) => (
            <WebsiteCard key={index} site={site} index={index} />
          ))}
        </div>

        <div className="mt-64 text-center">
          <Link to="/work" className="inline-flex items-center gap-6 px-12 py-6 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> 
            <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Back to Portfolio</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const LogosPage = () => {
  const logos = [
    {
      name: "Millburn 250th Anniversary",
      description: "An award-winning municipal visual identity designed to signify 250 years of communal heritage and civic progress. The logo features a sophisticated interplay of historical symbolism and modern typography, capturing the township's evolution from a colonial outpost to a thriving suburban hub. The mark is extensively deployed across the town's digital presence (Instagram/Facebook) and physical landscape, from historical banners to commemorative infrastructure, serving as a pillar of the community's year-long celebration.",
      image: "/52901996075.png",
      category: "Municipal Branding"
    },
    {
      name: "Artisanal Baking Narrative",
      description: "A refined brand identity and visual strategy developed for a boutique artisanal baking influencer. This project transformed a personal Instagram journey into a professional digital presence, capturing the warmth of home-baked craftsmanship through sophisticated typography and soft, organic palettes. The identity was crafted to elevate social media content and position the account for high-level culinary collaborations while honoring its authentic roots.",
      image: "/MomLogo.png",
      category: "Digital Brand Identity"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-40 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.5em] mb-6">Brand Identity</h2>
            <h1 className="text-7xl md:text-[10vw] font-display font-black tracking-tighter text-white uppercase mb-12 leading-[0.85]">
              Logo<span className="text-brand-blue italic">Studies</span>
            </h1>
            <p className="text-white/40 text-xl max-w-3xl mx-auto font-medium tracking-wide">
              Distilling complex brand stories into <span className="text-white">iconic visual marks.</span> Every logo is a study in composition, balance, and strategic communication.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 mb-10 transition-all duration-700 group-hover:border-brand-blue/30 group-hover:shadow-[0_0_50px_rgba(0,102,255,0.1)]">
                <img 
                  src={logo.image} 
                  alt={logo.name}
                  className="w-full h-full object-contain p-12 transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-brand-blue font-mono text-[10px] uppercase tracking-widest mb-4">{logo.category}</p>
              <h3 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-6 leading-none">
                {logo.name}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-xl font-medium">
                {logo.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-40 text-center">
          <Link to="/work" className="inline-flex items-center gap-6 px-12 py-6 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> 
            <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Back to Portfolio</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const GraphicsPage = () => {
  const imageIds = [
    "1-48LO4-80eUwrifzfuZCNheJ3EMWFh4h", "1-6p4PgO6qw8YyLjP7XZ_WZLLyF2HB0MF", "10dI2OdnA7ZubRXV-3s7EGyDpxI8lMk9u",
    "11azebqPmf0aZFqEhalqw3DG2At1YC5jA", "12kTjmTHFGX24EvNP5uLXwaBezs1SoAJG", "12zTR_56M5hCNiYevhqpekaHmD5ViLOXr",
    "15KXXQ0IbVQU_dbWVkrslhgihYiRSeMaZ", "16-Dy-4-k_opkpkaHIiPwPqwxFCM4Ac28", "16LVupnW7YKNjBWtmvsMI8OfqjpUj7xWZ",
    "16eFo3w9Jp1qklhZrZd17qL3tkhEuKhqU", "17_tqZC4VCUBI20CZQVjkihNcIQing89p", "18Jp9uxiPLzZfQT7_vWhpvNnLYAiwyWFj",
    "18pQCrbbZiqjRn8T2kodFCNK8ssrTRlAV", "18pZ0y1nR8G4ohoixbGLVIdplclwJtu6C", "18qLAshwUxUfdjnx-t1B46OfLR86CUmtf",
    "1AN-54fuXNPiOjeHioFxLA93Ak8QDI1gV", "1AOD_7iCnaTXg-62wYAYcV5ot7SUBlog3", "1AkbWVi_SRqHmeF_KtKIUE09_auuHr_UL",
    "1BHg47boDMCAFYht-nyYxVV_iqRiWFEdc", "1BsbtLUyjXMxSY3NaTCmNbE5QPaDuLlCw", "1D4UN06Ea-FO0ttynJrMvm7GVUnTxmDzk",
    "1ECdD13Fe30G0EFxdcPxu1qeeBOEpLCVt", "1EVwQV9aAjpjWgJgZfFPRFjWAnZp4cryf", "1FBpcml_wKWKoN1PF2qyerH9ds4JDFyPc",
    "1Gkk2n7OkcBaxBemScWR_ClFAZNHXfc1Z", "1KKxodohM3wTGKli7G_PWQ4Sfsevck2OJ", "1KSVWDNhUZM8AfXLQouVYfHIGiw7p9h11",
    "1KbZf9QRx81aqOXPaFaW5akiuCvggwPwa", "1L-8BPks1U6KYxTYyUxKFwRO5mEC-QJ-f", "1LjOg6jslRyEC6VQXXr0-PF82WRr88BAb",
    "1MBOMXuJusgHSBgC5SNbuQtmrlzs5E5YP", "1Mqa_vIrXDTr3VGbiU3KJPP-yIFve-G0q", "1NJVGP3BVVveZLkvn106AK5zm-NgOv65b",
    "1NLoYiuuLl_EkpbJVurqt8zyoSunemrcB", "1NNKTpmdiKYsOJBO1BYZL3vuxoy_lrjO3", "1O9pF0_4YjrQYrY6YR0C8QKoh_Et227tj",
    "1Pk3v_NYHa_0zMTu6JDs4pRK4hg01KyTP", "1Q2ZIeho1d8BNC0m4H9LW-axuAWa9IDIc", "1T3939fLHP8ti29Ktj4fX_8Dl9Ra0HCRp",
    "1U4Q7NmXh40TqCVUbttTbmQCFbypz6yry", "1V7OMq7MWcOANOSkyNUjsiRUEDbXvAmsR", "1V9pXKBeF-k8MbEMYk43LsyNwQiXHGp57",
    "1WR1qY1KU1vIw_d9dhMY351-ZSojiqAfO", "1WbCS_xt6uooqHnTuEYj-gH6hyN25txXl", "1_gzxezRvUkhkpxqG-AzhUvhl2J19OMZm",
    "1_ii_gwBIB9LG5lNWfbN_4WuaxQS6zNrv", "1a2X-npY7OeuJ3n6nSS0lZr2Xkp4eSxxd", "1aoIi34qqF0Ru1OaC5QJms4iNQkgje4fa",
    "1boDi7FXRXKv55mEWMdQvR683Jlx9I2mA", "1c1_OeD7iSQIzRJHP4AT3yr00q7vF42FZ", "1cenR_QS4XBImwaGTg1kfh0jY74D5cifT",
    "1gQL6k_0Ompy497WgB6ucjcVX0KuNKfu9", "1hRk9sE_tGQHe9w64BHokkxspDzxdVrke", "1iuCOm9FOcJ4XPWG38iRH9Ru7HdpvW2K0",
    "1j7OnSKw6Mcbkdb9FKMwAbW-og8skFR0f", "1kpaGFx-VNgqGzSQbX_Iu9OSpBxH7tFss", "1l2dCU9VMlNKTbcg3H-Hu5I1w4dBjmbbx",
    "1ljHVC8mA3FYW9oNstJiPFSUh5aW55NCf", "1n1qz3W-ecJ53f8J3_sT5VIHwo8eLLJ_c", "1ovSPgfUc_lhK7wyfD5qEfbR7N9iu7Ir5",
    "1p_NvJvT0IvjlanyCCFVu94bE2152cZhi", "1qTgJLrHzEkS2DWQCXNcapRUDE8PPehxv", "1rS8FWmZ3uZeEQrcCjIOhDokIJMInqRIl",
    "1tXkL6XFcSkFo6c1NHbeyyUfhAldZJy-C", "1urJOAvqQuYJV8dqu5IC0orZshzx1HOL7", "1vH3sjcUfVR7fdND5VMb_S7jrSVioz7jy",
    "1xakjRYcqrGg8BvHRDfcekIsSdJ3G3WrR"
  ];

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-32 pb-20 px-6 md:px-12"
      ref={containerRef}
    >
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.5em] mb-4">Portfolio / Archive</h2>
          <h1 className="text-5xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none mb-8">
            Visual <span className="text-brand-blue italic">Concepts</span>
          </h1>
          <div className="flex flex-wrap items-center gap-6">
            <p className="text-white/40 max-w-xl text-sm leading-relaxed">
              A curated collection of visual identities, digital illustrations, and conceptual designs. 
              Each piece is a study in composition, color theory, and brand storytelling.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-white/10" />
              <span className="text-brand-blue font-mono text-[10px] uppercase tracking-widest">{imageIds.length} Artifacts</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Grid Gallery */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
        {imageIds.map((id, index) => {
          // Create a "Bento" pattern by making some cards larger
          const isLarge = index % 7 === 0;
          const isWide = index % 11 === 0;
          const isTall = index % 5 === 0;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: (index % 8) * 0.05,
                ease: [0.23, 1, 0.32, 1]
              }}
              className={cn(
                "relative group cursor-pointer rounded-2xl overflow-hidden border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-brand-blue/30 hover:shadow-[0_0_30px_rgba(0,102,255,0.15)]",
                isLarge ? "col-span-2 row-span-2" : 
                isWide ? "col-span-2 row-span-1" : 
                isTall ? "col-span-1 row-span-2" : 
                "col-span-1 row-span-1"
              )}
              onClick={() => setSelectedImage(id)}
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-brand-blue font-mono text-[10px] uppercase tracking-widest mb-1">Artifact {index + 1}</p>
                  <h3 className="text-white font-display font-black text-lg uppercase leading-none">Visual Concept</h3>
                </motion.div>
              </div>
              
              <img 
                src={`https://lh3.googleusercontent.com/d/${id}`}
                alt={`Graphic ${index}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                referrerPolicy="no-referrer"
                loading="lazy"
              />

              {/* Decorative Corner */}
              <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox / Quick View */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-fit max-h-fit rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 z-50 p-3 bg-black/50 hover:bg-brand-blue text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>
              
              <img 
                src={`https://lh3.googleusercontent.com/d/${selectedImage}`}
                alt="Full Preview"
                className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain block mx-auto"
                referrerPolicy="no-referrer"
              />
              
              <div className="p-8 bg-gradient-to-t from-black to-transparent border-t border-white/5">
                <h3 className="text-white font-display font-black text-3xl uppercase tracking-tighter">Visual Concept Detail</h3>
                <p className="text-white/60 text-sm mt-2 font-mono uppercase tracking-widest">Archive ID: {selectedImage.substring(0, 8)}...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="max-w-7xl mx-auto mt-32 text-center">
        <Link to="/work" className="inline-flex items-center gap-6 px-12 py-6 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> 
          <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Back to Portfolio</span>
        </Link>
      </div>
    </motion.div>
  );
};

const CommunitySection = () => {
  return (
    <section className="py-32 bg-black border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] -mr-64 -mt-64" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.5em] mb-6">Social Impact</h2>
              <h3 className="text-5xl md:text-8xl font-display font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
                Design for <br /> <span className="text-brand-blue italic">Community</span>
              </h3>
              <p className="text-white/60 text-lg md:text-xl font-medium tracking-wide leading-relaxed mb-12 max-w-2xl">
                Beyond the screen, design has the power to unite and inspire. I partner with local organizations and social initiatives to craft visual stories that resonate within our community.
              </p>
              
              <Link to="/community">
                <button className="px-12 py-6 border border-white text-white font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500 flex items-center gap-4 group">
                  Explore Community Work <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </div>
          
          <div className="lg:w-1/3 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="aspect-square rounded-full border border-white/10 flex items-center justify-center relative bg-white/5"
            >
              <div className="absolute inset-0 rounded-full border border-brand-blue/20 animate-ping opacity-20" />
              <Users size={80} className="text-brand-blue opacity-40" />
              
              {/* Floating Labels */}
              <div className="absolute top-1/4 -right-4 bg-white/10 backdrop-blur-md px-4 py-2 border border-white/10 text-white font-mono text-[8px] uppercase tracking-widest">Client Work</div>
              <div className="absolute bottom-1/4 -left-12 bg-brand-blue/20 backdrop-blur-md px-4 py-2 border border-brand-blue/30 text-white font-mono text-[8px] uppercase tracking-widest">Volunteer</div>
              <div className="absolute top-10 left-10 bg-white/10 backdrop-blur-md px-4 py-2 border border-white/10 text-white font-mono text-[8px] uppercase tracking-widest">Non-Profit</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CommunityPage = () => {
  const socialProjects = [
    {
      title: "Millburn 250th",
      category: "Municipal Branding / Volunteer",
      description: "An award-winning visual identity for Millburn Township. A blend of history and modernity designed for the community's milestone celebration.",
      image: "/52901996075.png"
    },
    {
      title: "Influencer Brand",
      category: "Personal Brand Identity / Client",
      description: "Crafting a unique visual narrative for a high-profile influencer, centering on authenticity and aesthetic digital presence.",
      image: "/MomLogo.png"
    },
    {
      title: "Local Sports Training",
      category: "Community Business / Client",
      description: "Developing robust visual systems for local athletic programs, focusing on energy, performance, and professional appeal.",
      image: "https://files.catbox.moe/m5dird.png"
    },
    {
       title: "Youth Outreach",
       category: "Social Initiative / Volunteer",
       description: "Creating engaging visual materials for youth-focused programs to foster participation and increase community visibility.",
       image: "https://lh3.googleusercontent.com/d/1ljHVC8mA3FYW9oNstJiPFSUh5aW55NCf"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-40"
    >
      <div className="container mx-auto px-6">
        <div className="mb-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.5em] mb-6">Partnerships / Advocacy</h2>
            <h1 className="text-7xl md:text-[12vw] font-display font-black tracking-tighter text-white uppercase mb-12 leading-[0.85]">
              Comm<span className="text-brand-blue italic">unity</span>
            </h1>
            <p className="text-white/40 text-xl max-w-3xl mx-auto font-medium tracking-wide leading-relaxed">
              Leveraging design to empower <span className="text-white">local voices, non-profits, and cultural initiatives.</span> Every project is a commitment to positive social resonance.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {socialProjects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group"
            >
              <div className="relative aspect-[16/9] mb-10 overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <h3 className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.5em] mb-4">{project.category}</h3>
              <h4 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-4">{project.title}</h4>
              <p className="text-white/40 text-sm max-w-md leading-relaxed">{project.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-64 text-center">
          <Link to="/" className="inline-flex items-center gap-6 px-12 py-6 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> 
            <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Back to Hub</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <CommunitySection />
      <ParallaxComponent />
      <AboutSection />
      <ContactSection />
      <div className="osmo-credits">
        <p className="osmo-credits__p">
          Crafted by Jonah D. &copy; 2026
        </p>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <main className="bg-black relative min-h-screen">
        {/* Global Space Gradient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#1e3a8a_0%,_transparent_50%)] opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_#0f172a_0%,_transparent_50%)] opacity-40" />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="relative z-10">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/websites" element={<WebsitesPage />} />
              <Route path="/work/logos" element={<LogosPage />} />
              <Route path="/work/graphics" element={<GraphicsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/community" element={<CommunityPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </BrowserRouter>
  );
}
