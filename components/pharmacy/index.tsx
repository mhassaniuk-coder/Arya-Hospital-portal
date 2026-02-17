import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill,
  Truck,
  Plus,
  Search,
  List,
  X,
  AlertCircle,
} from 'lucide-react';
import { Medication, PharmacyOrder } from '../../types';
import { MedicationCard } from './MedicationCard';
import { MedicationFormModal } from './MedicationFormModal';
import { RefillRequestModal } from './RefillRequestModal';
import { DeliveryTracker } from './DeliveryTracker';
import { staggerContainer, listContainer } from '../../utils/animations';
import type { MedicationFormData } from './types';

interface PharmacyProps {
  medications: Medication[];
  orders: PharmacyOrder[];
  onAddMedication: (med: Medication) => void;
  onUpdateMedication: (id: string, med: Medication) => void;
  onDeleteMedication: (id: string) => void;
  onRequestRefill?: (med: Medication) => void;
}

export const Pharmacy: React.FC<PharmacyProps> = ({
  medications,
  orders,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  onRequestRefill,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [refillMedication, setRefillMedication] = useState<Medication | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Medication | null>(null);

  const activeOrder = orders.find(
    (o) => o.status !== 'delivered'
  ) || null;

  const filteredMedications = useMemo(() => {
    return medications
      .filter((med) => {
        const matchesTab =
          activeTab === 'active'
            ? med.status === 'active'
            : med.status === 'completed';
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          med.name.toLowerCase().includes(term) ||
          med.prescribedBy.toLowerCase().includes(term) ||
          med.dosage.toLowerCase().includes(term);
        return matchesTab && matchesSearch;
      })
      .sort((a, b) => {
        if (activeTab === 'active') {
          return (a.refillsRemaining ?? 0) - (b.refillsRemaining ?? 0);
        }
        return new Date(b.datePrescribed || 0).getTime() - new Date(a.datePrescribed || 0).getTime();
      });
  }, [medications, activeTab, searchTerm]);

  const handleSaveMedication = (data: MedicationFormData, id?: string) => {
    const med: Medication = {
      id: id || `m${Date.now()}`,
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      refillsRemaining: data.refillsRemaining,
      prescribedBy: data.prescribedBy,
      datePrescribed: data.datePrescribed || undefined,
      status: data.status,
      nextRefill: data.nextRefill || undefined,
      instructions: data.instructions || undefined,
    };
    if (id) {
      onUpdateMedication(id, med);
    } else {
      onAddMedication(med);
    }
    setFormModalOpen(false);
    setEditingMedication(null);
  };

  const handleEdit = (med: Medication) => {
    setEditingMedication(med);
    setFormModalOpen(true);
  };

  const handleDelete = (med: Medication) => {
    setDeleteConfirm(med);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteMedication(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleRequestRefillClick = (med: Medication) => {
    setRefillMedication(med);
    setRefillModalOpen(true);
  };

  const handleRefillConfirm = (med: Medication) => {
    onRequestRefill?.(med);
    setRefillMedication(null);
    setRefillModalOpen(false);
  };

  const openCreateForm = () => {
    setEditingMedication(null);
    setFormModalOpen(true);
  };

  return (
    <motion.div
      className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Pharmacy & Meds</h1>
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
              <List size={10} className="mr-1" /> {medications.length} Total
            </span>
          </div>
          <p className="text-slate-500 text-sm">Manage prescriptions, refills, and track deliveries.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-arya-600 text-white px-6 py-3 rounded-xl hover:bg-arya-700 transition-all shadow-lg shadow-arya-200 font-semibold"
        >
          <Plus size={18} />
          Add Medication
        </button>
      </div>

      {/* Delivery Tracker */}
      {activeOrder && <DeliveryTracker order={activeOrder} />}

      {/* Tabs & Search */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'active'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              History
            </button>
          </div>
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search medication or prescriber..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Medication List */}
      <motion.div
        className="grid md:grid-cols-1 gap-4"
        variants={listContainer}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {filteredMedications.length > 0 ? (
            filteredMedications.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRequestRefill={handleRequestRefillClick}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="text-slate-300" size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {activeTab === 'active' ? 'No active medications' : 'No history yet'}
              </h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">
                {activeTab === 'active'
                  ? 'Add a medication or check the history tab for past prescriptions.'
                  : 'Completed medications will appear here.'}
              </p>
              {activeTab === 'active' && (
                <button
                  onClick={openCreateForm}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-arya-600 font-semibold hover:bg-arya-50 rounded-xl transition-colors"
                >
                  <Plus size={18} />
                  Add Medication
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Create/Edit Modal */}
      <MedicationFormModal
        isOpen={formModalOpen}
        medication={editingMedication}
        existingMedications={medications}
        onSave={handleSaveMedication}
        onClose={() => {
          setFormModalOpen(false);
          setEditingMedication(null);
        }}
      />

      {/* Refill Request Modal */}
      <RefillRequestModal
        isOpen={refillModalOpen}
        medication={refillMedication}
        onConfirm={handleRefillConfirm}
        onClose={() => {
          setRefillModalOpen(false);
          setRefillMedication(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <AlertCircle size={28} />
                <h3 className="text-lg font-bold text-slate-800">Delete medication?</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Remove <strong>{deleteConfirm.name}</strong> from your list? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
