import React from 'react';
import { 
  Quote, 
  Linkedin, 
  Twitter, 
  Mail, 
  Phone, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import ceoPhoto from '../../../../assets/images/CEO.jpeg';

interface CeoSectionProps {
  /** Optional custom CEO Name placeholder. Defaults to "Mr. Pema Tshering" */
  ceoName?: string;
  /** Optional custom CEO Title placeholder. Defaults to "Founder & Chief Executive Officer" */
  ceoTitle?: string;
  /** Optional custom image source. Easy to override with any image URL */
  imageSrc?: string;
  /** Optional custom image alt text */
  imageAlt?: string;
}

export const CeoSection: React.FC<CeoSectionProps> = ({
  ceoName = "Mr. Pema Tshering",
  ceoTitle = "Founder & Chief Executive Officer",
  imageSrc = ceoPhoto,
  imageAlt = "Mr. Pema Tshering - Founder & CEO of Bhutan Land of Happiness Tours"
}) => {

  return (
    <section id="about-ceo" className="bg-[#fcf8f3] border border-[#e2d1be] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-10 my-8">
      
      {/* Section Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5eee4] border border-[#d96b27]/30 text-[#d96b27] text-xs font-serif font-bold uppercase tracking-widest shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#d96b27]" />
          <span>Driven by Passion & Purpose</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3b2314] tracking-tight">
          Meet Our Executive Leadership
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm font-serif leading-relaxed">
          Guiding Bhutan Land of Happiness Tours with visionary stewardship, cultural mastery, and an unwavering commitment to Gross National Happiness.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column (Desktop) / Top Column (Mobile): High-Quality Executive Image Container */}
        <div className="lg:col-span-5 space-y-5">
          <div className="relative group mx-auto max-w-md lg:max-w-none">
            
            {/* Background Decorative Glow & Frame Accent */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#d96b27]/20 via-[#3b2314]/10 to-amber-500/20 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main Image Aspect Ratio Container */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#d96b27]/40 bg-[#3b2314] shadow-xl">
              
              {/* 
                ===================================================================
                STATIC IMAGE SETUP INSTRUCTIONS FOR DEVELOPERS / CLIENT:
                To replace this CEO headshot with your own photo:
                1. Update the `imageSrc` prop when calling <CeoSection imageSrc="URL" />
                2. Or change the default import/src attribute below.
                ===================================================================
              */}
              <img
                src={imageSrc}
                alt={imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Scrim for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b2314] via-transparent to-black/20 opacity-80" />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 bg-[#3b2314]/90 backdrop-blur-md border border-[#d96b27]/50 text-amber-100 text-[11px] font-serif font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d96b27]" />
                <span>Official Govt Approved</span>
              </div>

              {/* Floating Bottom Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#3b2314]/85 backdrop-blur-md border border-[#d96b27]/40 text-amber-50 space-y-1 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#d96b27] uppercase tracking-wider font-serif">
                    Proprietor & Founder
                  </span>
                  <span className="text-[10px] text-amber-200/80 font-mono flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-[#d96b27]" /> Novelist
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-amber-100 leading-snug">
                  {ceoName}
                </h3>
                <p className="text-xs text-amber-200/90 font-serif">
                  {ceoTitle}
                </p>
              </div>

            </div>
          </div>

          {/* Quick Credential Badges Row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-[#e2d1be] shadow-2xs">
              <span className="block font-serif font-bold text-base text-[#3b2314]">15+</span>
              <span className="text-[10px] text-stone-600 font-serif">Years Experience</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#e2d1be] shadow-2xs">
              <span className="block font-serif font-bold text-base text-[#d96b27]">Bumthang</span>
              <span className="text-[10px] text-stone-600 font-serif">Native Roots</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#e2d1be] shadow-2xs">
              <span className="block font-serif font-bold text-base text-[#3b2314]">100%</span>
              <span className="text-[10px] text-stone-600 font-serif">GNH Values</span>
            </div>
          </div>
        </div>

        {/* Right Column (Desktop) / Bottom Column (Mobile): Executive Copy & Bio */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header & Titles */}
          <div className="space-y-2 border-b border-[#e2d1be] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d96b27] animate-pulse" />
              <span className="text-xs font-bold text-[#d96b27] uppercase tracking-wider font-serif">
                Executive Profile
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3b2314]">
              {ceoName}
            </h3>
            <p className="text-sm font-serif font-semibold text-stone-700 flex items-center gap-2">
              <span>{ceoTitle}</span>
              <span className="text-amber-400">•</span>
              <span className="text-stone-500 font-normal">Published Bhutanese Author</span>
            </p>
          </div>

          {/* Key Philosophy Pull-Quote Block */}
          <div className="relative bg-[#3b2314] text-amber-50 rounded-2xl p-5 sm:p-6 border-l-4 border-[#d96b27] shadow-md space-y-3">
            <Quote className="w-8 h-8 text-[#d96b27]/40 absolute top-4 right-4" />
            <p className="font-serif italic text-sm sm:text-base text-amber-100 leading-relaxed relative z-10">
              "Our primary concern is not to kill the golden goose, but to care for it with utmost love and affection. We strive to deliver authentic, sustainable tour programs augmented by superlative, personalized service."
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-[#5c3820] text-xs font-serif text-amber-200/80">
              <span className="font-semibold text-[#d96b27]">— Executive Philosophy</span>
              <span className="italic">Gross National Happiness Model</span>
            </div>
          </div>

          {/* Executive Biography Text */}
          <div className="space-y-3.5 text-stone-700 text-xs sm:text-sm font-serif leading-relaxed">
            <p>
              As the founder and financial pillar of <strong>Bhutan Land of Happiness Tours</strong>, <strong>{ceoName}</strong> brings a lifetime of deep cultural immersion and entrepreneurial visionary leadership. Hailing from the pristine district of Bumthang, his early interactions with international travelers inspired a lifelong mission to showcase the Kingdom with unyielding hospitality and authentic care.
            </p>
            <p>
              Under his guidance, the company has built an unrivaled reputation for operational excellence—investing directly in luxury transport fleets, top-tier hotel partnerships, and highly trained local guides certified by the Tourism Authority of Bhutan. His financial stewardship guarantees seamless travel logistics without hidden costs.
            </p>
            <p>
              Beyond his business achievements, Mr. Tshering stands out as a distinguished Bhutanese novelist—one of the third recorded authors from Bumthang. His scholarly command over Bhutan’s geography, sacred history, and traditions ensures every guest experiences genuine cultural depth.
            </p>
          </div>

          {/* Leadership Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-[#e2d1be]">
              <CheckCircle2 className="w-4 h-4 text-[#d96b27] shrink-0" />
              <span className="text-xs font-serif font-bold text-[#3b2314]">Authentic Cultural Immersion</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-[#e2d1be]">
              <CheckCircle2 className="w-4 h-4 text-[#d96b27] shrink-0" />
              <span className="text-xs font-serif font-bold text-[#3b2314]">Sacred Art & Thangka Expertise</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-[#e2d1be]">
              <CheckCircle2 className="w-4 h-4 text-[#d96b27] shrink-0" />
              <span className="text-xs font-serif font-bold text-[#3b2314]">Transparent Fair Pricing</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-[#e2d1be]">
              <CheckCircle2 className="w-4 h-4 text-[#d96b27] shrink-0" />
              <span className="text-xs font-serif font-bold text-[#3b2314]">100% Certified Local Staff</span>
            </div>
          </div>

          {/* Social Links & Micro-Interaction Action Bar */}
          <div className="pt-4 border-t border-[#e2d1be] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Social & Direct Contact Links */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif text-stone-500 mr-1 hidden sm:inline">Connect:</span>
              
              {/* LinkedIn Button */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-xl bg-white border border-[#e2d1be] text-[#3b2314] hover:bg-[#3b2314] hover:text-white hover:border-[#3b2314] flex items-center justify-center transition-all duration-300 shadow-2xs hover:scale-105"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* Twitter / X Button */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter X Profile"
                className="w-9 h-9 rounded-xl bg-white border border-[#e2d1be] text-[#3b2314] hover:bg-[#3b2314] hover:text-white hover:border-[#3b2314] flex items-center justify-center transition-all duration-300 shadow-2xs hover:scale-105"
              >
                <Twitter className="w-4 h-4" />
              </a>

              {/* Direct Email Link */}
              <a
                href="mailto:pemsbumthap@gmail.com"
                aria-label="Send Email to CEO"
                className="w-9 h-9 rounded-xl bg-white border border-[#e2d1be] text-[#3b2314] hover:bg-[#d96b27] hover:text-white hover:border-[#d96b27] flex items-center justify-center transition-all duration-300 shadow-2xs hover:scale-105"
              >
                <Mail className="w-4 h-4" />
              </a>

              {/* Direct Call Link */}
              <a
                href="tel:+97517377777"
                aria-label="Call CEO Office"
                className="w-9 h-9 rounded-xl bg-white border border-[#e2d1be] text-[#3b2314] hover:bg-[#d96b27] hover:text-white hover:border-[#d96b27] flex items-center justify-center transition-all duration-300 shadow-2xs hover:scale-105"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
