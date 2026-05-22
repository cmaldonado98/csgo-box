import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onAccept: () => void;
  userName: string;
}

export default function Modal({ isOpen, onAccept, userName }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-sm overflow-hidden border-2 border-csgo-gold bg-zinc-900 shadow-2xl relative"
            style={{ boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
          >
            {/* Header / Banner dorado */}
            <div className="bg-gradient-to-r from-csgo-gold/20 via-csgo-gold/50 to-csgo-gold/20 p-6 flex flex-col items-center justify-center border-b border-csgo-gold/30">
               <img src="/logo-crew.png" alt="Crew Logo" className="w-24 h-24 mb-4 object-contain" />
               <motion.h2 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="text-2xl font-bold text-center text-csgo-gold tracking-widest leading-tight uppercase font-sans"
               >
                 Objeto Especial
               </motion.h2>
            </div>

            <div className="p-6 text-center space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                  ¡Has sacado el rol de<br/>
                  <span className="text-csgo-gold">Caballero de Honor!</span>
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {userName}, se viene el día más importante y necesito a la crew para esta misión en Mexicali. ¿Aceptas la misión para el día de mi boda?
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={onAccept}
                className="w-full py-4 px-6 bg-gradient-to-b from-[#5c8a47] to-[#456b35] hover:from-[#6a9e52] hover:to-[#507d3e] text-white font-bold tracking-widest uppercase transition-all duration-200 border border-[#2d4722] rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95"
              >
                ACEPTAR MISIÓN
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
