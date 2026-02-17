import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pill, Save, Sparkles, Loader2, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Medication } from '../../types';
import { scaleIn } from '../../utils/animations';
import { geminiService } from '../../services/geminiService';
import type { MedicationFormData } from './types';

const emptyForm: MedicationFormData = {
  name: '',
  dosage: '',
  frequency: 'Daily',
  refillsRemaining: 0,
  prescribedBy: '',
  datePrescribed: new Date().toISOString().split('T')[0],
  status: 'active',
  nextRefill: '',
  instructions: '',
};

interface InteractionResult {
  hasInteraction: boolean;
  severity: string;
  details: string;
  recommendations: string[];
}

interface MedicationFormModalProps {
  isOpen: boolean;
  medication: Medication | null;
  existingMedications?: Medication[];
  onSave: (data: MedicationFormData, id?: string) => void;
  onClose: () => void;
}

const FREQUENCY_OPTIONS = ['Daily', 'Twice daily', 'Every 8 hours', 'Weekly', 'As needed', 'Other'];

export const MedicationFormModal: React.FC<MedicationFormModalProps> = ({
  isOpen,
  medication,
  existingMedications = [],
  onSave,
  onClose,
}) => {
  const [form, setForm] = useState<MedicationFormData>(emptyForm);
  const [isCheckingInteraction, setIsCheckingInteraction] = useState(false);
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);
  const [interactionDismissed, setInteractionDismissed] = useState(false);

  useEffect(() => {
    if (medication) {
      setForm({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        refillsRemaining: medication.refillsRemaining,
        prescribedBy: medication.prescribedBy,
        datePrescribed: medication.datePrescribed || new Date().toISOString().split('T')[0],
        status: medication.status,
        nextRefill: medication.nextRefill || '',
        instructions: medication.instructions || '',
      });
    } else {
      setForm({ ...emptyForm, datePrescribed: new Date().toISOString().split('T')[0] });
    }
    setInteractionResult(null);
    setInteractionDismissed(false);
  }, [medication, isOpen]);

  const handleCheckInteractions = async () => {
    if (!form.name.trim() || existingMedications.length === 0) return;

    setIsCheckingInteraction(true);
    try {
      const currentMedNames = existingMedications
        .filter(m => m.status === 'active' && m.id !== medication?.id)
        .map(m => `${m.name} ${m.dosage}`);

      if (currentMedNames.length === 0) {
        setInteractionResult({ hasInteraction: false, severity: 'none', details: 'No other active medications to compare against.', recommendations: [] });
      } else {
        const result = await geminiService.checkMedicationInteractions(
          currentMedNames,
          `${form.name} ${form.dosage}`
        );
        setInteractionResult(result);
      }
    } catch {
      setInteractionResult({ hasInteraction: false, severity: 'none', details: 'Unable to check at this time.', recommendations: [] });
    }
    setIsCheckingInteraction(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form, medication?.id);
    onClose();
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'severe': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: ShieldAlert, iconColor: 'text-red-500' };
      case 'moderate': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: AlertTriangle, iconColor: 'text-amber-500' };
      case 'mild': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: AlertTriangle, iconColor: 'text-yellow-500' };
      default: return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle, iconColor: 'text-green-500' };
    }
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-arya-50 p-2 rounded-xl">
                <Pill className="text-arya-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {medication ? 'Edit Medication' : 'Add Medication'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setInteractionResult(null); }}
                  placeholder="e.g. Lipitor"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={form.dosage}
                    onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                    placeholder="e.g. 20mg"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Frequency
                  </label>
                  <select
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                    title="Frequency"
                    aria-label="Frequency"
                  >
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AI Interaction Checker */}
              {!medication && form.name.trim() && (
                <div className="border border-dashed border-arya-200 rounded-2xl p-4 bg-arya-50/50">
                  <button
                    type="button"
                    onClick={handleCheckInteractions}
                    disabled={isCheckingInteraction}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-arya-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:shadow-md transition-all disabled:opacity-60"
                  >
                    {isCheckingInteraction ? (
                      <><Loader2 size={16} className="animate-spin" /> Checking Interactions...</>
                    ) : (
                      <><Sparkles size={16} /> Check Drug Interactions</>
                    )}
                  </button>

                  {interactionResult && !interactionDismissed && (
                    <div className="mt-3 animate-fade-in">
                      {(() => {
                        const styles = getSeverityStyles(interactionResult.severity);
                        const IconComp = styles.icon;
                        return (
                          <div className={`p-4 rounded-xl border ${styles.bg} ${styles.border}`}>
                            <div className="flex items-start gap-3">
                              <IconComp size={20} className={`${styles.iconColor} shrink-0 mt-0.5`} />
                              <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                  <p className={`font-bold text-sm ${styles.text}`}>
                                    {interactionResult.hasInteraction
                                      ? `${interactionResult.severity.charAt(0).toUpperCase() + interactionResult.severity.slice(1)} Interaction Detected`
                                      : 'No Interactions Found'}
                                  </p>
                                  <button type="button" onClick={() => setInteractionDismissed(true)} className="text-slate-400 hover:text-slate-600">
                                    <X size={14} />
                                  </button>
                                </div>
                                <p className="text-xs text-slate-600 mt-1">{interactionResult.details}</p>
                                {interactionResult.recommendations.length > 0 && (
                                  <ul className="mt-2 space-y-1">
                                    {interactionResult.recommendations.map((rec, i) => (
                                      <li key={i} className="text-xs text-slate-500 flex items-start gap-1">
                                        <span className="text-arya-600 font-bold">•</span> {rec}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                <p className="text-[10px] text-slate-400 mt-2 italic">⚕️ Informational only. Always consult your pharmacist.</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Prescribed By
                  </label>
                  <input
                    type="text"
                    value={form.prescribedBy}
                    onChange={(e) => setForm({ ...form, prescribedBy: e.target.value })}
                    placeholder="e.g. Dr. Chen"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Refills Remaining
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.refillsRemaining}
                    onChange={(e) =>
                      setForm({ ...form, refillsRemaining: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                    title="Refills remaining"
                    placeholder="0"
                    aria-label="Refills remaining"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Date Prescribed
                  </label>
                  <input
                    type="date"
                    value={form.datePrescribed}
                    onChange={(e) => setForm({ ...form, datePrescribed: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                    title="Date prescribed"
                    aria-label="Date prescribed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Next Refill Date
                  </label>
                  <input
                    type="date"
                    value={form.nextRefill}
                    onChange={(e) => setForm({ ...form, nextRefill: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                    title="Next refill date"
                    aria-label="Next refill date"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as 'active' | 'completed' })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                  title="Status"
                  aria-label="Status"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Instructions (optional)
                </label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  placeholder="Take with food, avoid alcohol..."
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-arya-600 text-white rounded-xl font-semibold hover:bg-arya-700 transition-colors shadow-lg shadow-arya-200"
              >
                <Save size={18} />
                {medication ? 'Save Changes' : 'Add Medication'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
