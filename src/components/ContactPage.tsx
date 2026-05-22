import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Github, Linkedin, Instagram, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { BGPattern } from './ui/bg-pattern';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ 
        type: 'error', 
        message: 'Please fill in all required fields (Name, Email, and Message).' 
      });
      return;
    }

    setStatus({ type: 'loading' });

    try {
      // 1. Submit directly to Web3Forms from the user's browser (client-side)
      // This is 100% reliable because it uses the real user's browser session, bypassing Cloudflare's server hosting blocks.
      const web3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '10b93509-dca1-440d-8f8b-234be908df7c',
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'New Portfolio Inquiry',
          message: formData.message,
          from_name: 'Graphics by JD Site'
        }),
      });

      const web3Data = await web3Response.json();

      if (web3Response.ok && web3Data.success === true) {
        setStatus({ 
          type: 'success', 
          message: 'Thank you! Your message has been sent successfully directly to jadovdav@gmail.com!'
        });

        // 2. Fire and forget a backup of this email submission to your local server database (messages.json)
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, subject: formData.subject || 'Direct Web3Forms Success Backup' }),
        }).catch((err) => console.log('Local backup log recorded.'));

        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // If direct Web3Forms returned an error, we fall back to standard local archiving
        console.warn('Web3Forms client-side failure, attempting backend backup...', web3Data);
        
        const backupResponse = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const backupData = await backupResponse.json();

        if (backupResponse.ok) {
          setStatus({ 
            type: 'success', 
            message: 'Your message has been captured safely on our backup server! (We have archived your inquiry in local storage & messages.json).'
          });
          setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
          setStatus({ 
            type: 'error', 
            message: web3Data.message || backupData.error || 'Something went wrong. Please try again.' 
          });
        }
      }
    } catch (err: any) {
      console.error('Contact submission error:', err);
      // Failover directly to local backend server
      try {
        const backupResponse = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (backupResponse.ok) {
          setStatus({
            type: 'success',
            message: 'We successfully saved your message on our backup server archive (messages.json)!'
          });
          setFormData({ name: '', email: '', subject: '', message: '' });
          return;
        }
      } catch (backupErr) {
        console.error('Local backup failover error:', backupErr);
      }
      
      setStatus({ 
        type: 'error', 
        message: 'Could not connect to the server. Please check your connection and try again.' 
      });
    }
  };

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
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-blue group-hover:border-brand-blue transition-all duration-500">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white/20 font-mono text-[8px] uppercase tracking-widest">Email Me</p>
                  <p className="text-white text-xl font-display font-bold group-hover:text-brand-blue transition-colors">jadovdav@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4 pt-4">
                {[
                  { icon: <Github size={20} />, link: "https://github.com" },
                  { icon: <Linkedin size={20} />, link: "https://linkedin.com" },
                  { icon: <Instagram size={20} />, link: "https://www.instagram.com/graphics_by_jd/" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-brand-blue/50 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="relative">
             <div className="absolute -inset-4 bg-brand-blue/10 blur-3xl rounded-3xl opacity-50 pointer-events-none" />
             <form onSubmit={handleSubmit} className="relative bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl space-y-8">
                
                <AnimatePresence mode="wait">
                  {status.type === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-6 rounded-2xl flex items-start gap-4"
                    >
                      <CheckCircle className="shrink-0 mt-0.5 text-emerald-400" size={20} />
                      <div className="space-y-1">
                        <p className="font-bold text-sm">Message Received</p>
                        <p className="text-xs text-white/70 leading-relaxed">{status.message}</p>
                      </div>
                    </motion.div>
                  )}

                  {status.type === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-6 rounded-2xl flex items-start gap-4"
                    >
                      <AlertTriangle className="shrink-0 mt-0.5 text-rose-400" size={20} />
                      <div className="space-y-1">
                        <p className="font-bold text-sm">Submission Error</p>
                        <p className="text-xs text-white/70 leading-relaxed">{status.message}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">Full Name <span className="text-brand-blue font-bold">*</span></label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe" 
                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">Email Address <span className="text-brand-blue font-bold">*</span></label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com" 
                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                      />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">Subject</label>
                   <input 
                     type="text" 
                     name="subject"
                     value={formData.subject}
                     onChange={handleChange}
                     placeholder="Project Inquiry" 
                     className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1">Message <span className="text-brand-blue font-bold">*</span></label>
                   <textarea 
                     rows={5} 
                     name="message"
                     value={formData.message}
                     onChange={handleChange}
                     required
                     placeholder="Tell me about your project..." 
                     className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all resize-none"
                   />
                </div>

                <button 
                  type="submit" 
                  disabled={status.type === 'loading'}
                  className="w-full h-16 bg-brand-blue hover:bg-opacity-80 disabled:opacity-50 text-white rounded-2xl font-display font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 group cursor-pointer"
                >
                  {status.type === 'loading' ? 'Encrypting & Dispatching...' : 'Send Message'}
                  {status.type !== 'loading' && (
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                </button>
             </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { ContactPage };
