import React, { useState } from 'react';
import { ImagingReport } from '../../types';
import { Image as ImageIcon, FileText, Share2, Download, Eye, AlertCircle } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

const MOCK_IMAGING: ImagingReport[] = [
    {
        id: 'img1',
        modality: 'X-Ray',
        bodyPart: 'Chest PA View',
        date: '2023-11-10',
        status: 'Normal',
        radiologist: 'Dr. Sarah Smith',
        imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=500',
        findings: 'Cardiomediastinal silhouette is within normal limits. Lungs are clear. No pleural effusion or pneumothorax.'
    },
    {
        id: 'img2',
        modality: 'MRI',
        bodyPart: 'Brain (Non-contrast)',
        date: '2023-09-15',
        status: 'Abnormal',
        radiologist: 'Dr. James Wilson',
        imageUrl: 'https://images.unsplash.com/photo-1628544222384-6ce5cb5d7426?auto=format&fit=crop&q=80&w=500',
        findings: 'Small area of high T2 signal in the periventricular white matter, non-specific.'
    },
    {
        id: 'img3',
        modality: 'Ultrasound',
        bodyPart: 'Abdomen Complete',
        date: '2023-05-22',
        status: 'Normal',
        radiologist: 'Dr. Anita Roy',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1673984534123-5e921d1b919e?auto=format&fit=crop&q=80&w=500',
        findings: 'Liver, gallbladder, pancreas, spleen, and kidneys are unremarkable.'
    }
];

export const ImagingReports: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<ImagingReport | null>(null);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Radiology & Imaging</h2>
                    <p className="text-slate-500 text-sm">View scans, X-rays, and radiologist reports</p>
                </div>
                <button className="text-arya-600 font-semibold text-sm hover:underline">Request New Scan</button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_IMAGING.map(img => (
                    <div key={img.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        {/* Image Mockup */}
                        <div
                            className="h-48 bg-slate-900 relative cursor-pointer overflow-hidden"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img src={img.imageUrl} alt={img.bodyPart} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <Eye className="text-white drop-shadow-lg" size={32} />
                            </div>
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs font-bold">
                                {img.modality}
                            </div>
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold ${img.status === 'Abnormal' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'
                                }`}>
                                {img.status}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{img.bodyPart}</h3>
                            </div>
                            <p className="text-xs text-slate-400 mb-4">{new Date(img.date).toLocaleDateString()} • {img.radiologist}</p>

                            <div className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-3 italic">
                                "{img.findings}"
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 flex items-center justify-center gap-2">
                                    <FileText size={16} /> Report
                                </button>
                                <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-arya-600 hover:bg-arya-50 transition-colors">
                                    <Download size={18} />
                                </button>
                                <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-arya-600 hover:bg-arya-50 transition-colors">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Viewer Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col animate-fade-in text-white">
                    <div className="p-4 flex justify-between items-center border-b border-white/10">
                        <div>
                            <h3 className="font-bold text-lg">{selectedImage.modality} - {selectedImage.bodyPart}</h3>
                            <p className="text-slate-400 text-sm">{new Date(selectedImage.date).toLocaleDateString()}</p>
                        </div>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>
                    <div className="flex-grow flex items-center justify-center p-4">
                        <img
                            src={selectedImage.imageUrl}
                            alt={selectedImage.bodyPart}
                            className="max-h-[80vh] max-w-full object-contain rounded-sm shadow-2xl"
                        />
                    </div>
                    <div className="p-6 bg-white/5 border-t border-white/10">
                        <h4 className="font-semibold mb-2 text-slate-300">Radiologist Findings</h4>
                        <p className="max-w-4xl">{selectedImage.findings}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
