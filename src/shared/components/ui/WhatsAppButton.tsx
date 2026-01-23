'use client';

/**
 * WhatsAppButton Component
 * Modern floating WhatsApp contact button with animations
 */

import { MessageCircle, X } from 'lucide-react';
import { SITE_CONFIG } from '@/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function WhatsAppButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    const message = encodeURIComponent(
      `Halo ${SITE_CONFIG.name}, saya ingin bertanya tentang program HMJF.`
    );
    window.open(
      `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`,
      '_blank'
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-4 max-w-xs border-2 border-green-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Ada pertanyaan?</h4>
                <p className="text-sm text-gray-600">
                  Chat dengan kami untuk info lebih lanjut tentang HMJF!
                </p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <div className="relative">
        {/* Single pulse ring - optimized */}
        <div className="absolute inset-0 animate-ping-slow">
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-30" />
        </div>

        {/* Button */}
        <motion.button
          onClick={handleClick}
          onHoverStart={() => setIsExpanded(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group"
          aria-label="Chat via WhatsApp"
        >
          <MessageCircle className="w-8 h-8" />

          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
