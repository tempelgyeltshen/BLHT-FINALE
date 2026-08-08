import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../../core/providers/AppProvider';
import { WHATSAPP_URL } from '../../../config/constants';
import { CountrySelect } from '../../shared/components/feedback/CountrySelect';
import { Button, Input, TextArea } from '../../shared/components/ui';
import { isValidEmail, isRequired } from '../../shared/utils/validators';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Shield, MessageCircle } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { submitInquiry, showToast } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    interests: ['Luxury Tour'],
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRequired(formData.fullName) || !isRequired(formData.email)) {
      showToast('Please fill in your name and email address.');
      return;
    }
    if (!isValidEmail(formData.email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    // Create email content
    const emailSubject = `New Inquiry from ${formData.fullName}`;
    const emailBody = `
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Country: ${formData.country || 'Not provided'}
Interests: ${formData.interests.join(', ')}

Message:
${formData.message}
    `.trim();

    // Open email client with pre-filled content
    const mailtoLink = `mailto:tempelgyeltshen12345@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');

    // Also submit to the system
    submitInquiry(formData);
    setSubmitted(true);
    showToast('Inquiry submitted - Email client opened');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-3 max-w-2xl mx-auto"
      >
        <span className="text-amber-800 font-bold text-xs uppercase tracking-widest font-serif">Direct Contact & Official Portal</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-950">Bhutan Land of Happiness Tours</h1>
        <p className="text-stone-600 text-xs sm:text-sm font-serif">
          View our curated packages and itineraries. For official bookings, please visit our official booking portal at{' '}
          <a href="https://www.bhutanlhtours.com/" target="_blank" rel="noopener noreferrer" className="text-[#d96b27] font-bold hover:underline">
            www.bhutanlhtours.com
          </a>.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Info Box */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-amber-950 text-amber-50 rounded-3xl p-8 space-y-6 border border-amber-800 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-700/50 flex items-center justify-center text-amber-300 font-serif text-2xl font-bold border border-amber-500/30 shrink-0">
              𖤍
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-amber-100">Bhutan Land of Happiness Tours</h3>
              <p className="text-[10px] text-amber-300 uppercase tracking-widest font-sans">Thimphu, Kingdom of Bhutan</p>
            </div>
          </div>

          <div className="space-y-5 text-xs text-amber-200/90 pt-4 border-t border-amber-800">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-100 block mb-0.5">Headquarters Address</span>
                <span>TDSC Building, Norzin Lam, Building no: 45 Flat no 202, Thimphu Bhutan.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-100 block mb-0.5">Contact Numbers</span>
                <span className="font-mono text-amber-200">+975-17377777 / +975-77444445</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-100 block mb-0.5">Official Email</span>
                <a href="mailto:bhutanlhtours@gmail.com" className="text-amber-300 hover:underline">bhutanlhtours@gmail.com</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-100 block mb-0.5">Official Booking Portal</span>
                <a 
                  href="https://www.bhutanlhtours.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-300 font-bold hover:underline flex items-center gap-1 mt-1"
                >
                  https://www.bhutanlhtours.com/
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-amber-800 space-y-3">
            <a
              href="https://www.bhutanlhtours.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#d96b27] hover:bg-[#b85116] text-white font-serif font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Visit Official Booking Website</span>
            </a>
            
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-serif font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact via WhatsApp</span>
            </a>
            
            <div className="flex items-center gap-2 text-[11px] text-amber-300">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Licensed Tourism Operator (#BLHT-8842)</span>
            </div>
          </div>
        </motion.div>

        {/* Form Box */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2 bg-white rounded-3xl border border-amber-200 p-8 shadow-md"
        >
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-stone-900">Inquiry Received</h3>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto font-serif">
                Thank you, {formData.fullName}. Our Executive Director Dasho Tashi Wangchuk will contact you at <span className="font-semibold text-amber-900">{formData.email}</span> within 12 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-serif font-bold text-xl text-amber-950">Send an Inquiry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  labelClassName="block text-xs font-semibold text-stone-700 mb-1"
                  variant="public"
                  required
                  placeholder="e.g. Lady Eleanor Vance"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />

                <Input
                  label="Email Address *"
                  labelClassName="block text-xs font-semibold text-stone-700 mb-1"
                  variant="public"
                  type="email"
                  required
                  placeholder="e.g. eleanor@vancemanor.co.uk"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />

                <Input
                  label="Phone / WhatsApp"
                  labelClassName="block text-xs font-semibold text-stone-700 mb-1"
                  variant="public"
                  type="tel"
                  placeholder="+44 7700 900123"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Country of Residence *</label>
                  <CountrySelect
                    value={formData.country}
                    onChange={(val) => setFormData({ ...formData, country: val })}
                    required
                  />
                </div>
              </div>

              <TextArea
                label="Message / Travel Aspirations"
                labelClassName="block text-xs font-semibold text-stone-700 mb-1"
                variant="public"
                rows={4}
                required
                placeholder="Share your travel dates, preferred lodges (Six Senses, COMO, Pemako), group size, or special requests..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />

              <Button type="submit" variant="gradient" size="full">
                <Send className="w-4 h-4 text-amber-300" />
                <span>Submit</span>
              </Button>
            </form>
          )}
        </motion.div>

      </div>

    </div>
  );
};
