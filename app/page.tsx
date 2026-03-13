'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import Image from 'next/image';
import { ArrowUpRight, Github, Linkedin, Instagram } from 'lucide-react';
import portfolioData from './data/portfolio.json';

export default function Portfolio() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const numProjects = portfolioData.selectedWorks.projects.length;
  const numExperiencePages = Math.ceil(portfolioData.experience.items.length / 2);
  const totalScreens = 1 + 1 + numProjects + numExperiencePages + 1;
  const totalSteps = totalScreens - 1;

  const input = Array.from({ length: totalScreens }, (_, i) => i / totalSteps);

  const xOutput = ["0vw", "-100vw"];
  for (let i = 0; i < numProjects; i++) xOutput.push("-200vw");
  for (let i = 0; i < numExperiencePages; i++) xOutput.push("-300vw");
  xOutput.push("-400vw");
  const x = useTransform(springScroll, input, xOutput);

  const projectsYOutput = ["0vh", "0vh"];
  for (let i = 0; i < numProjects; i++) projectsYOutput.push(`-${i * 100}vh`);
  for (let i = 0; i < numExperiencePages; i++) projectsYOutput.push(`-${Math.max(0, numProjects - 1) * 100}vh`);
  projectsYOutput.push(`-${Math.max(0, numProjects - 1) * 100}vh`);
  const projectsY = useTransform(springScroll, input, projectsYOutput);

  const expYOutput = ["0vh", "0vh"];
  for (let i = 0; i < numProjects; i++) expYOutput.push("0vh");
  for (let i = 0; i < numExperiencePages; i++) expYOutput.push(`-${i * 100}vh`);
  expYOutput.push(`-${Math.max(0, numExperiencePages - 1) * 100}vh`);
  const experienceY = useTransform(springScroll, input, expYOutput);

  return (
    <main ref={targetRef} className="relative bg-[#050505] text-[#e0e0e0]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x, width: `${totalScreens * 100}vw` }} className="flex h-screen">
          
          {/* 1. Home */}
          <section className="w-screen h-screen flex flex-col justify-center px-8 md:px-24 relative shrink-0 overflow-hidden bg-[#050505]">
            <div className="absolute top-12 left-8 md:left-24 z-20">
              <span className="font-serif text-xl tracking-widest uppercase">{portfolioData.home.initials}</span>
            </div>
            
            {/* Rectangular Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="hidden md:block absolute right-8 md:right-24 top-1/2 -translate-y-1/2 w-[30vw] max-w-[450px] aspect-[3/4] z-0"
            >
              <Image 
                src={portfolioData.home.photo} 
                alt={`${portfolioData.home.name} Portrait`} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
                priority
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="max-w-4xl z-10 relative pointer-events-none"
            >
              <h1 className="font-serif text-6xl md:text-8xl lg:text-[10rem] leading-none tracking-tighter font-light mb-6 mix-blend-difference text-white">
                {portfolioData.home.name}
              </h1>
              <p className="text-lg md:text-2xl font-light tracking-wide text-[#a0a0a0] max-w-xl mix-blend-difference">
                {portfolioData.home.description}
              </p>
            </motion.div>
            
            <div className="absolute bottom-12 left-8 md:left-24 flex items-center gap-4 text-sm tracking-widest uppercase text-[#a0a0a0] z-10">
              <span>Scroll to explore</span>
              <div className="w-12 h-[1px] bg-[#a0a0a0]"></div>
            </div>
          </section>

          {/* 2. About */}
          <section className="w-screen h-screen flex items-center px-8 md:px-24 shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.5 }}
                className="relative aspect-[3/4] w-full max-w-md mx-auto md:mx-0 overflow-hidden rounded-sm"
              >
                <Image 
                  src={portfolioData.about.photo} 
                  alt="About Portrait" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="max-w-xl"
              >
                <h2 className="font-serif text-4xl md:text-6xl font-light mb-8">{portfolioData.about.title}</h2>
                <div className="space-y-6 text-[#a0a0a0] text-lg font-light leading-relaxed">
                  <p>
                    {portfolioData.about.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#e0e0e0]/10 mt-8">
                    {portfolioData.about.details.map((detail, index) => (
                      <div key={index}>
                        <span className="block text-xs uppercase tracking-widest text-[#e0e0e0] mb-2">{detail.label}</span>
                        <span className="font-light">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 3. Projects (Vertical Scroll) */}
          <section className="w-screen h-screen shrink-0 overflow-hidden relative">
            <motion.div style={{ y: projectsY, height: `${numProjects * 100}vh` }} className="flex flex-col w-full">
              
              {portfolioData.selectedWorks.projects.map((project, index) => (
                <div key={index} className="w-screen h-screen flex items-center px-8 md:px-24 shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 w-full h-full py-24">
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true, amount: 0.5 }}
                      className={`md:col-span-4 flex flex-col justify-end pb-12 ${index % 2 !== 0 ? 'order-1 md:order-2' : ''}`}
                    >
                      <span className="text-sm tracking-widest uppercase text-[#a0a0a0] mb-4">
                        {String(index + 1).padStart(2, '0')} / {portfolioData.selectedWorks.title}
                      </span>
                      <h2 className="font-serif text-5xl md:text-7xl font-light mb-6">{project.name}</h2>
                      <p className="text-[#a0a0a0] font-light mb-8 max-w-sm">
                        {project.description}
                      </p>
                      <a href={project.link} className="inline-flex items-center gap-2 text-sm tracking-widest uppercase hover:text-white transition-colors w-fit group">
                        View Project <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true, amount: 0.5 }}
                      className={`md:col-span-8 relative h-full w-full overflow-hidden rounded-sm group ${index % 2 !== 0 ? 'order-2 md:order-1' : ''}`}
                    >
                      <Image 
                        src={project.photo} 
                        alt={`${project.name} Project`} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </div>
                </div>
              ))}

            </motion.div>
          </section>

          {/* 4. Work Experience (Vertical Scroll) */}
          <section className="w-screen h-screen shrink-0 overflow-hidden relative">
            <motion.div style={{ y: experienceY, height: `${numExperiencePages * 100}vh` }} className="flex flex-col w-full">
              
              {Array.from({ length: numExperiencePages }).map((_, pageIndex) => {
                const itemsForPage = portfolioData.experience.items.slice(pageIndex * 2, pageIndex * 2 + 2);
                
                return (
                  <div key={pageIndex} className="w-screen h-screen flex items-center px-8 md:px-24 shrink-0">
                    <div className="w-full max-w-4xl mx-auto">
                      {pageIndex === 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          viewport={{ once: true, amount: 0.5 }}
                        >
                          <h2 className="font-serif text-5xl md:text-7xl font-light mb-16">{portfolioData.experience.title}</h2>
                        </motion.div>
                      )}
                      
                      <div className="space-y-12">
                        {itemsForPage.map((item, itemIndex) => (
                          <motion.div 
                            key={itemIndex}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 + (itemIndex * 0.1) }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 border-t border-[#e0e0e0]/10 pt-8"
                          >
                            <div className="text-[#a0a0a0] text-sm tracking-widest uppercase mt-1">{item.time}</div>
                            <div className="md:col-span-3">
                              <h3 className="text-2xl font-light mb-2">{item.title}</h3>
                              <h4 className="text-[#a0a0a0] mb-4">{item.company}</h4>
                              <p className="text-[#a0a0a0] font-light leading-relaxed">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

            </motion.div>
          </section>

          {/* 5. Contact */}
          <section className="w-screen h-screen flex flex-col justify-center items-center px-8 md:px-24 relative shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full max-w-5xl items-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <h2 className="font-serif text-5xl md:text-8xl font-light mb-8">{portfolioData.contact.title}</h2>
                <p className="text-xl text-[#a0a0a0] font-light mb-12">
                  {portfolioData.contact.description}
                </p>
                <div className="flex flex-col gap-2">
                  <span className="text-sm tracking-widest uppercase text-[#a0a0a0]">Email</span>
                  <a href={`mailto:${portfolioData.contact.email}`} className="text-2xl font-light hover:text-white transition-colors">{portfolioData.contact.email}</a>
                </div>
              </motion.div>

              <motion.form 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="flex flex-col gap-6 w-full"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm tracking-widest uppercase text-[#a0a0a0]">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-transparent border-b border-[#e0e0e0]/30 py-2 focus:outline-none focus:border-[#e0e0e0] transition-colors font-light" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm tracking-widest uppercase text-[#a0a0a0]">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-transparent border-b border-[#e0e0e0]/30 py-2 focus:outline-none focus:border-[#e0e0e0] transition-colors font-light" 
                    placeholder="john@example.com" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm tracking-widest uppercase text-[#a0a0a0]">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="bg-transparent border-b border-[#e0e0e0]/30 py-2 focus:outline-none focus:border-[#e0e0e0] transition-colors font-light resize-none" 
                    placeholder="Hello..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="mt-4 self-start border border-[#e0e0e0]/30 rounded-full px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#e0e0e0] hover:text-[#050505] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                </button>
                {status === 'error' && (
                  <p className="text-red-400 text-sm mt-2">Failed to send message. Please try again.</p>
                )}
              </motion.form>
            </div>
            
            <div className="absolute bottom-12 w-full px-8 md:px-24 flex justify-between items-center text-sm text-[#a0a0a0] tracking-widest uppercase left-0">
              <span>© {new Date().getFullYear()}</span>
              <div className="flex gap-6">
                {portfolioData.contact.socials.map((social, index) => {
                  let Icon = null;
                  if (social.name.toLowerCase() === 'instagram') Icon = Instagram;
                  if (social.name.toLowerCase() === 'linkedin') Icon = Linkedin;
                  if (social.name.toLowerCase() === 'github') Icon = Github;
                  
                  return (
                    <a key={index} href={social.link} className="hover:text-white transition-colors">
                      {Icon ? <Icon className="w-5 h-5" /> : social.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </section>

        </motion.div>
      </div>

      {/* Snap points */}
      <div className="w-full pointer-events-none -mt-[100vh]">
        {Array.from({ length: totalScreens }).map((_, i) => (
          <div key={i} className="h-screen w-full snap-start" />
        ))}
      </div>
    </main>
  );
}
