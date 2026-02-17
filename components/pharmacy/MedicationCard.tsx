import React from 'react';
import { motion } from 'framer-motion';
import { Pill, CheckCircle, AlertCircle, MoreVertical, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { Medication } from '../../types';
import { listItem } from '../../utils/animations';

interface MedicationCardProps {
  medication: Medication;
  onEdit: (med: Medication) => void;
  onDelete: (med: Medication) => void;
  onRequestRefill: (med: Medication) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onEdit,
  onDelete,
  onRequestRefill,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const isLowRefills = medication.refillsRemaining < 1;
  const isActive = medication.status === 'active';

  return (
    <motion.div
      layout
      variants={listItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start gap-4"
    >
      <div className="flex gap-4 flex-grow min-w-0">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
          <Pill size={24} />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-slate-800 text-lg">{medication.name}</h4>
          <p className="text-sm text-slate-500 font-medium">
            {medication.dosage} • {medication.frequency}
          </p>
          {medication.instructions && (
            <p className="text-xs text-slate-400 mt-1">{medication.instructions}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                isLowRefills ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {medication.refillsRemaining} Refills Left
            </span>
            {isLowRefills && isActive && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <AlertCircle size={10} /> Renew
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">Prescribed by {medication.prescribedBy}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-right hidden sm:block">
          <span className="block text-xs text-slate-400 font-bold uppercase mb-1">Status</span>
          <span
            className={`text-sm font-bold flex items-center justify-end gap-1 ${
              isActive ? 'text-green-600' : 'text-slate-500'
            }`}
          >
            <CheckCircle size={14} />
            {isActive ? 'Active' : 'Completed'}
          </span>
        </span>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Actions"
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
                aria-hidden
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-1 py-1 bg-white rounded-xl border border-slate-200 shadow-lg z-20 min-w-[160px]"
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(medication);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Edit2 size={14} /> Edit
                </button>
                {isActive && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onRequestRefill(medication);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCcw size={14} /> Request Refill
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(medication);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
