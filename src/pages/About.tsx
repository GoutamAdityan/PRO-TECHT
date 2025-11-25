import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Target, Heart, Globe, Zap } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const About = () => {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-border p-8 md:p-16 mb-12 text-center">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-emerald-200 to-emerald-400">
            About Pro-Techt
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We are revolutionizing product lifecycle management by bridging the gap between consumers, businesses, and service centers with transparency, efficiency, and trust.
          </p>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <AnimatedCard className="h-full border-border hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To empower product owners and creators with a centralized, intelligent platform that simplifies service management, enhances product value, and fosters lasting relationships built on trust and exceptional care.
          </p>
        </AnimatedCard>

        <AnimatedCard delay={0.1} className="h-full border-border hover:border-blue-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <Globe className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To be the leading global ecosystem for product care, recognized for innovation, reliability, and unparalleled customer satisfaction, creating a seamless future where every product is valued and maintained.
          </p>
        </AnimatedCard>
      </div>

      {/* Core Values */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Heart, color: 'text-red-400', bg: 'bg-red-500/20', title: 'Customer Centricity', desc: 'We put our users at the heart of every decision we make.' },
            { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20', title: 'Innovation', desc: 'Continuously pushing boundaries to find better solutions.' },
            { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/20', title: 'Integrity', desc: 'Operating with absolute honesty, transparency, and security.' },
          ].map((value, index) => (
            <AnimatedCard key={index} delay={0.2 + (index * 0.1)} hoverEffect="lift" className="text-center border-border">
              <div className={`inline-flex p-4 rounded-full ${value.bg} ${value.color} mb-4`}>
                <value.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Meet the Team</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          The brilliant minds behind Pro-Techt. We're a team of caffeine-powered innovators who take our code seriously, but ourselves? Not so much.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "JEY PRANAV",
              image: "/team/pranav.png",
              description: "The 'idea guy' who turns coffee into code and bugs into features. Has more GitHub commits than sleep hours."
            },
            {
              name: "KAVIN KRISH",
              image: "/team/kavin.jpg",
              description: "Our design wizard who believes every pixel matters. Can spot a 1px misalignment from across the room."
            },
            {
              name: "GOUTAM ADITYAN",
              image: "/team/goutam.png",
              description: "The debugging ninja. If your code breaks, he's already fixed it before you noticed. Speaks fluent console.log."
            },
            {
              name: "LAKSHMI NARASSIMA KG",
              image: "/team/lakshmi.png",
              description: "Our backend sorcerer. Turned 'It works on my machine' into 'It works everywhere.' Database whisperer extraordinaire."
            },
            {
              name: "HARI KARTHIK",
              image: "/team/hari.png",
              description: "The optimization guru. Made the app so fast, users think their internet got upgraded. Caches dreams for better performance."
            },
            {
              name: "AMUDHAN",
              image: "/team/amudhan.jpg",
              description: "The problem solver with infinite patience. Turns 'impossible' into 'give me 5 minutes.' Still waiting for a bug that can outsmart him."
            }
          ].map((member, index) => (
            <AnimatedCard
              key={index}
              delay={0.1 * index}
              className="border-border hover:border-emerald-500/30 transition-all group"
            >
              <div className="aspect-square overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default About;