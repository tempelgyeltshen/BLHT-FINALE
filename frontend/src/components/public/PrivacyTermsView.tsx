import React from 'react';
import { Shield, FileText } from 'lucide-react';

export const PrivacyTermsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-amber-800 font-bold text-xs uppercase tracking-widest font-serif">Department Guidelines</span>
        <h1 className="font-serif text-3xl font-bold text-amber-950">Privacy Policy, Visa Terms & SDF Compliance</h1>
      </div>

      <div className="bg-white rounded-3xl border border-amber-200 p-8 shadow-sm space-y-6 text-xs text-stone-700 leading-relaxed font-serif">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-amber-950">1. Sustainable Development Fee (SDF) & Visa Processing</h2>
          <p>
            The Government of Bhutan imposes a Sustainable Development Fee (SDF) of $100 USD per adult per night (50% discount for children aged 6 to 12). All BLHT luxury packages automatically bundle full SDF taxes and official entry clearances into your single total tariff.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-amber-950">2. Privacy & High-Profile Guest Confidentiality</h2>
          <p>
            Bhutan Luxury & Heritage Tours strictly adheres to international data privacy regulations. Guest passport details, flight manifests, personal butler requests, and private helicopter charters are maintained in encrypted records accessible solely by our Executive Board.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-amber-950">3. Deposit & Cancellation Terms</h2>
          <p>
            A 30% deposit is required upon reservation confirmation to secure Six Senses, COMO Uma, or Pemako lodge suite allocations and Drukair flights. Full balance is due 45 days prior to arrival.
          </p>
        </section>
      </div>
    </div>
  );
};
