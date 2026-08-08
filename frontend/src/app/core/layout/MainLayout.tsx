import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from '../../features/shared/components/layout/Navbar';
import { Footer } from '../../features/shared/components/layout/Footer';
import { WhatsAppButton } from '../../features/shared/components/feedback/WhatsAppButton';

/**
 * Main public layout: sticky Navbar on top, animated route content in the
 * middle, and the Footer below. Used as the layout route for all public pages.
 */
export const MainLayout: React.FC = () => {
  const outlet = useOutlet();
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};
