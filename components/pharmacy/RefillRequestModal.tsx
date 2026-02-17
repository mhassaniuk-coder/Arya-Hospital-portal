import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, CheckCircle } from 'lucide-react';
import { Medication } from '../../types';
import { scaleIn } from '../../utils/animations';

interface RefillRequestModalProps {
  isOpen: boolean;
  medication: Medication | null;
  onConfirm: (med: Medication) => void;
  onClose: () => void;
}

export const RefillRequestModal: React.FC<RefillRequestModalProps> = ({
  isOpen,
  medication,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !medication) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-arya-50 p-2 rounded-xl">
                <RotateCcw className="text-arya-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Request Refill</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-slate-600 mb-6">
            Request a refill for <strong>{medication.name}</strong> ({medication.dosage})? Your
            pharmacy will be notified and you can pick up when ready.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(medication);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-arya-600 text-white rounded-xl font-semibold hover:bg-arya-700 transition-colors shadow-lg shadow-arya-200"
            >
              <CheckCircle size={18} />
              Request Refill
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
