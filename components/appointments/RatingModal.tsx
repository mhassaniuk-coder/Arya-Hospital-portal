import React, { useState } from 'react';
import { X, Star, CheckCircle, Loader2 } from 'lucide-react';
import { Appointment } from '../../types';

interface RatingModalProps {
    appointment: Appointment;
    onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ appointment, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [review, setReview] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const quickTags = ['Professional', 'Thorough', 'Caring', 'Clear Explanation', 'On Time', 'Listened Well', 'Knowledgeable', 'Friendly Staff'];

    const toggleTag = (tag: string) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1200));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    const getRatingLabel = (r: number) => {
        if (r === 1) return 'Poor';
        if (r === 2) return 'Fair';
        if (r === 3) return 'Good';
        if (r === 4) return 'Very Good';
        if (r === 5) return 'Excellent';
        return '';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Rate Your Visit</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                <div className="p-6">
                    {!submitted ? (
                        <div className="space-y-5 animate-fade-in">
                            <div className="text-center">
                                <p className="text-sm text-slate-500 mb-1">How was your visit with</p>
                                <p className="font-bold text-slate-800 text-lg">{appointment.doctorName}</p>
                            </div>

                            {/* Stars */}
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-125"
                                    >
                                        <Star
                                            size={36}
                                            className={`transition-colors ${(hoveredRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {(hoveredRating || rating) > 0 && (
                                <p className="text-center text-sm font-bold text-amber-600">{getRatingLabel(hoveredRating || rating)}</p>
                            )}

                            {/* Quick Tags */}
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-2">What stood out?</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${tags.includes(tag) ? 'bg-arya-50 border-arya-300 text-arya-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Text */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Additional Comments (Optional)</label>
                                <textarea
                                    value={review}
                                    onChange={e => setReview(e.target.value)}
                                    placeholder="Share your experience..."
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none resize-none h-20"
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0 || isSubmitting}
                                className="w-full py-3 bg-arya-600 text-white rounded-xl font-bold hover:bg-arya-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : 'Submit Review'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-6 animate-fade-in">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Thank You!</h3>
                            <p className="text-slate-500 text-sm mb-4">Your feedback helps us improve care quality.</p>
                            <div className="flex justify-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={20} className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                                ))}
                            </div>
                            <button onClick={onClose} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">Close</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
