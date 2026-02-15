import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { SmartSlot } from '../../types';
import { GENERATE_SMART_SLOTS } from './types';

interface DateTimeSelectionProps {
  selectedDate: string;
  selectedSlot: SmartSlot | null;
  bookingMode: string;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: SmartSlot | null) => void;
}

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedSlot,
  bookingMode,
  onSelectDate,
  onSelectSlot,
}) => {
  // Generate next 14 days
  const dates = Array.from({length: 14}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Generate time slots
  const slots = GENERATE_SMART_SLOTS(selectedDate, 'in-person');
  const morningSlots = slots.filter(s => ['09:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'].includes(s.time));
  const afternoonSlots = slots.filter(s => ['12:00 PM', '01:00 PM', '02:00 PM', '02:30 PM'].includes(s.time));
  const eveningSlots = slots.filter(s => ['04:00 PM', '04:15 PM', '05:00 PM', '06:00 PM'].includes(s.time));

  const renderSlotGroup = (title: string, groupSlots: SmartSlot[], icon: React.ReactNode) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-slate-500">{title}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {groupSlots.map(slot => (
          <button
            key={slot.id}
            onClick={() => onSelectSlot(slot)}
            className={`p-3 rounded-xl border-2 transition-all text-center relative ${
              selectedSlot?.id === slot.id
                ? 'border-arya-500 bg-arya-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className={`font-semibold ${selectedSlot?.id === slot.id ? 'text-arya-600' : 'text-slate-700'}`}>
              {slot.time}
            </span>
            {slot.score && slot.score > 90 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                Best
              </span>
            )}
            {slot.tags.length > 0 && (
              <span className="block text-[10px] text-slate-400 mt-1">{slot.tags[0]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Date Selection */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Calendar size={16} />
          Select Date
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {dates.map((date, i) => {
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const isToday = i === 0;

            return (
              <button
                key={i}
                onClick={() => onSelectDate(dateStr)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? 'border-arya-500 bg-arya-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`block text-lg font-bold ${isSelected ? 'text-arya-600' : 'text-slate-700'}`}>
                  {date.getDate()}
                </span>
                {isToday && (
                  <span className="block text-[10px] text-arya-500 font-semibold">TODAY</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Clock size={16} />
          Select Time Slot
        </h3>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          {renderSlotGroup('Morning', morningSlots, <span className="text-yellow-500">🌅</span>)}
          {renderSlotGroup('Afternoon', afternoonSlots, <span className="text-orange-500">☀️</span>)}
          {renderSlotGroup('Evening', eveningSlots, <span className="text-purple-500">🌙</span>)}
        </div>
      </div>
    </div>
  );
};
