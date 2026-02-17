import React, { useState, useMemo } from 'react';
import { Search, TestTube, Filter, Plus, Check, Info, ChevronRight, Beaker } from 'lucide-react';
import { ServiceItem } from '../../types';

interface LabTestLibraryProps {
    onSelectTest: (test: ServiceItem) => void;
    onBack: () => void;
}

const LAB_CATEGORIES = [
    { id: 'all', label: 'All Tests' },
    { id: 'blood', label: 'Blood Work' },
    { id: 'urine', label: 'Urine Analysis' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'screening', label: 'Health Screening' },
    { id: 'allergy', label: 'Allergy' },
];

// Mock database of lab tests
const LAB_TESTS: ServiceItem[] = [
    { id: 'l1', name: 'Complete Blood Count (CBC)', description: 'Measures red & white blood cells, hemoglobin, and platelets.', price: 25, duration: '15 mins', category: 'Lab Test' },
    { id: 'l2', name: 'Lipid Profile', description: 'Measures cholesterol and triglycerides levels.', price: 35, duration: '15 mins', category: 'Lab Test' },
    { id: 'l3', name: 'Thyroid Function Test (TFT)', description: 'Checks T3, T4, and TSH levels.', price: 40, duration: '15 mins', category: 'Lab Test' },
    { id: 'l4', name: 'Liver Function Test (LFT)', description: 'Screens for liver damage and disease.', price: 45, duration: '15 mins', category: 'Lab Test' },
    { id: 'l5', name: 'Kidney Function Test (KFT)', description: 'Checks how well your kidneys are working.', price: 45, duration: '15 mins', category: 'Lab Test' },
    { id: 'l6', name: 'HbA1c (Diabetes)', description: 'Average blood sugar level over past 3 months.', price: 30, duration: '10 mins', category: 'Lab Test' },
    { id: 'l7', name: 'Vitamin D Total', description: 'Checks for Vitamin D deficiency.', price: 50, duration: '15 mins', category: 'Lab Test' },
    { id: 'l8', name: 'Vitamin B12', description: 'Measures vitamin B12 levels in blood.', price: 45, duration: '15 mins', category: 'Lab Test' },
    { id: 'l9', name: 'Urine Routine & Microscopy', description: 'Detects UTIs, kidney disease, and diabetes.', price: 20, duration: '10 mins', category: 'Lab Test' },
    { id: 'l10', name: 'PCR Details (COVID-19)', description: 'Detects active COVID-19 infection.', price: 60, duration: '15 mins', category: 'Lab Test' },
    { id: 'l11', name: 'Iron Studies', description: 'Checks iron levels to detect anemia.', price: 55, duration: '15 mins', category: 'Lab Test' },
    { id: 'l12', name: 'Electrolytes Panel', description: 'Measures sodium, potassium, chloride.', price: 30, duration: '15 mins', category: 'Lab Test' },
    { id: 'l13', name: 'Blood Culture', description: 'Detects infection in the bloodstream.', price: 80, duration: '20 mins', category: 'Lab Test' },
    { id: 'l14', name: 'Allergy Panel (Food)', description: 'Tests for common food allergies.', price: 120, duration: '20 mins', category: 'Lab Test' },
    { id: 'l15', name: 'Prostate Specific Antigen (PSA)', description: 'Screening for prostate cancer.', price: 65, duration: '15 mins', category: 'Lab Test' },
];

export const LabTestLibrary: React.FC<LabTestLibraryProps> = ({ onSelectTest, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedTests, setSelectedTests] = useState<string[]>([]);

    const filteredTests = useMemo(() => {
        return LAB_TESTS.filter(test => {
            const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                test.description.toLowerCase().includes(searchTerm.toLowerCase());
            // In a real app, items would have a category field matching the filter IDs.
            // For this mock, we'll just return true for 'all' and simulate filtering or just rely on search.
            // Let's refine mock filtering slightly based on name keywords for this demo.
            const matchesCategory = activeCategory === 'all' ? true :
                activeCategory === 'blood' ? !test.name.includes('Urine') && !test.name.includes('Imaging') :
                    activeCategory === 'urine' ? test.name.includes('Urine') :
                        activeCategory === 'screening' ? test.name.includes('Profile') || test.name.includes('Panel') :
                            true;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory]);

    const handleToggleTest = (id: string) => {
        setSelectedTests(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleContinue = () => {
        // For this implementation, we'll just select the first one if multiple are selected,
        // or modify the parent to handle multiple. The interface only accepts one `onSelectTest`.
        // Let's assume single selection for now or pass the primary one.
        // Ideally we'd update `onSelectTest` to accept an array, but to keep type safety with existing code...
        if (selectedTests.length > 0) {
            const test = LAB_TESTS.find(t => t.id === selectedTests[0]);
            if (test) onSelectTest(test);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-slate-100 sticky top-0 z-10">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                        <ChevronRight className="rotate-180" size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Lab Test Library</h2>
                        <p className="text-sm text-slate-500">Search and select tests to book</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for tests (e.g., CBC, Vitamin D, Thyroid)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-arya-200 outline-none transition-all shadow-sm"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
                    {LAB_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${activeCategory === cat.id
                                    ? 'bg-arya-600 text-white border-arya-600 shadow-md shadow-arya-200'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Test List */}
            <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-3">
                {filteredTests.length > 0 ? (
                    filteredTests.map(test => {
                        const isSelected = selectedTests.includes(test.id);
                        return (
                            <div
                                key={test.id}
                                onClick={() => handleToggleTest(test.id)}
                                className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${isSelected
                                        ? 'border-arya-500 ring-1 ring-arya-500 shadow-md'
                                        : 'border-slate-100 hover:border-arya-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-arya-100 text-arya-600' : 'bg-slate-50 text-slate-400 group-hover:text-arya-500 group-hover:bg-arya-50'
                                        }`}>
                                        <Beaker size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg ${isSelected ? 'text-arya-900' : 'text-slate-800'}`}>{test.name}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-1">{test.description}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                                            <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{test.duration}</span>
                                            <span className="text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100">${test.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-arya-600 border-arya-600' : 'border-slate-300 group-hover:border-arya-400'
                                    }`}>
                                    {isSelected && <Check size={14} className="text-white" />}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <TestTube size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No tests found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your search or category filter.</p>
                    </div>
                )}
            </div>

            {/* Floating Action Bar */}
            {selectedTests.length > 0 && (
                <div className="absolute bottom-6 left-6 right-6 z-20 animate-slide-up">
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 px-3 py-1 rounded-lg font-bold">
                                {selectedTests.length} selected
                            </div>
                            <div className="text-sm">
                                <p className="opacity-90">Estimated Total</p>
                                <p className="font-bold text-lg">
                                    ${selectedTests.reduce((sum, id) => sum + (LAB_TESTS.find(t => t.id === id)?.price || 0), 0)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleContinue}
                            className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center gap-2"
                        >
                            Continue <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
