// Re-export or extend pharmacy-specific types if needed.
// Main Medication & PharmacyOrder types come from root types.

export type MedicationFormData = {
  name: string;
  dosage: string;
  frequency: string;
  refillsRemaining: number;
  prescribedBy: string;
  datePrescribed: string;
  status: 'active' | 'completed';
  nextRefill: string;
  instructions: string;
};
