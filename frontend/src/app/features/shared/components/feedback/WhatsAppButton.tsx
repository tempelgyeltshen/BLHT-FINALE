import React from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../../../../config/constants';
import { useApp } from '../../../../core/providers/AppProvider';

export const WhatsAppButton: React.FC = () => {
  const { currentRoute } = useApp();

  // Keep the full-screen PDF reader completely clean — no floating chat bubble
  // covering the document.
  if (currentRoute === 'brochure-viewer' || currentRoute === 'admin-brochure-viewer') {
    return null;
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 animate-bounce-slow flex items-center justify-center group"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 bg-white text-[#25D366] px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
        Chat with us!
      </span>
    </a>
  );
};