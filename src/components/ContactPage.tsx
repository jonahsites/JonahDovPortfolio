import React from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Linkedin, Instagram, Send, ArrowRight } from 'lucide-react';
import { BGPattern } from './ui/bg-pattern';

const ContactPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black pt-40 pb-20 px-8 relative overflow-hidden"
    >
      <BGPattern variant="grid" mask="fade-edges" fill="rgba(0,102,255,0.1)" size={40} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Side: Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-brand-blue font-mono text-[10px] uppercase tracking-[0.5em] mb-4">Get In Touch</h2>
              <h1 className="text-6xl md:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none mb-8">
                Let's Build <br />
                <span className="text-brand-blue italic">Something</span> Great.
              </h1>
              <p className="text-white/40 max-w-md text-lg">
                Whether you have a specific project in mind or just want to explore possibilities, I'm always open to new connections and collaborations.
              </p>
            </div>

            <div className="space-y-6">
              <a href="mailto:jadovdav@gmail.com" className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-blue group-hover:border-brand-blue transition-all duration-500">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white/20 font-mono text-[8px] uppercase tracking-widest">Email Me</p>
                  <p className="text-white text-xl font-display font-bold group-hover:text-brand-blue transition-colors">jadovdav@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4 pt-4">
                {[
                  { icon: <Github size={20} />, link: "#" },
                  { icon: <Linkedin size={20} />, link: "#" },
                  { icon: <Instagram size={20} />, link: "#" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.link}
                    className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-brand-blue/50 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="relative">
             <div className="absolute -inset-4 bg-brand-blue/10 blur-3xl rounded-none opacity-50" />
             <form className="relative bg-white/5 border border-white/10 rounded-none p-8 md:p-12 backdrop-blur-xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-4 text-white focus:outline-none focus:border-brand-blue/50 transition-colors"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-4 text-white focus:outline-none focus:border-brand-blue/50 transition-colors"
                      />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">Subject</label>
                   <input 
                     type="text" 
                     placeholder="Project Inquiry" 
                     className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-4 text-white focus:outline-none focus:border-brand-blue/50 transition-colors"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">Message</label>
                   <textarea 
                     rows={5} 
                     placeholder="Tell me about your project..." 
                     className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-4 text-white focus:outline-none focus:border-brand-blue/50 transition-colors resize-none"
                   />
                </div>

                <button className="w-full h-16 bg-brand-blue hover:bg-blue-600 text-white rounded-none font-display font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 group">
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
             </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { ContactPage };
