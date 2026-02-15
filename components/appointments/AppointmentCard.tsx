import React from 'react';
import { 
  Clock, MapPin, Video, Home, User, Zap, Brain, Sparkles,
  PhoneOff, Mic, MicOff, Camera, CameraOff
} from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentCardProps {
  appointment: Appointment;
  onJoinVideoCall: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onJoinVideoCall 
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6 flex flex-col md:flex-row gap-6 relative">
        {/* Status indicator */}
        <div className={`absolute left-0 top-0 bottom-0 md:h-full w-full h-1.5 md:w-1.5 ${
          appointment.status === 'upcoming' ? 'bg-arya-500' : 
          appointment.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'
        }`}></div>
        
        {/* Date display */}
        <div className="mt-2 md:mt-0 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex md:flex-col flex-row items-center justify-between md:justify-center md:min-w-[100px] text-center gap-4 md:gap-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {new Date(appointment.date).toLocaleString('default', { month: 'short' })}
          </span>
          <span className="text-3xl font-bold text-slate-800 my-1">
            {new Date(appointment.date).getDate()}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(appointment.date).toLocaleString('default', { weekday: 'short' })}
          </span>
        </div>
        
        {/* Main content */}
        <div className="flex-grow space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-800 text-xl">{appointment.doctorName}</h3>
              <div className="flex flex-wrap gap-2 text-arya-600 font-medium text-sm items-center">
                <span>{appointment.specialty}</span>
                <span>•</span>
                <span className="capitalize">
                  {appointment.category === 'home-care' ? 'Home Care' : 
                   appointment.category === 'lab' ? 'Lab Test' : 
                   appointment.category === 'imaging' ? 'Imaging' : 'Consultation'}
                </span>
                {appointment.patientName && (
                  <>
                    <span>•</span>
                    <span className="text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                      <User size={12} /> {appointment.patientName}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Status badges */}
            {appointment.status === 'upcoming' && appointment.matchScore && (
              <div className="flex gap-2">
                <span className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center border border-green-100">
                  <Zap size={12} className="mr-1" /> {appointment.matchScore}% Match
                </span>
              </div>
            )}
            {appointment.status === 'completed' && (
              <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-bold">
                Completed
              </span>
            )}
            {appointment.status === 'cancelled' && (
              <span className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full font-bold">
                Cancelled
              </span>
            )}
          </div>
          
          {/* Time and location */}
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Clock size={16} className="mr-2 text-arya-500" />
              {appointment.time}
            </div>
            <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              {appointment.visitType === 'video' ? (
                <Video size={16} className="mr-2 text-arya-500" />
              ) : appointment.visitType === 'home-visit' ? (
                <Home size={16} className="mr-2 text-arya-500" />
              ) : (
                <MapPin size={16} className="mr-2 text-arya-500" />
              )}
              {appointment.location}
            </div>
            {appointment.smartTags && appointment.smartTags.map(tag => (
              <div key={tag} className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={12} className="mr-1" /> {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* AI Summary and actions */}
      {(appointment.aiSummary || appointment.prepInstructions) && (
        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-start gap-3 max-w-xl">
            <div className="bg-white p-2 rounded-full shadow-sm text-arya-600 mt-1 min-w-[32px]">
              <Brain size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase mb-1">AI Details</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                {appointment.aiSummary || appointment.prepInstructions?.join('. ')}
              </p>
            </div>
          </div>
          
          {appointment.status === 'upcoming' && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              {appointment.visitType === 'video' && (
                <button 
                  onClick={() => onJoinVideoCall(appointment)}
                  className="flex-1 md:flex-none py-2 px-4 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Video size={16}/> Join Call
                </button>
              )}
              <button className="flex-1 md:flex-none py-2 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                Reschedule
              </button>
              <button className="flex-1 md:flex-none py-2 px-4 bg-arya-600 text-white rounded-xl text-sm font-medium hover:bg-arya-700 transition-colors shadow-sm">
                Check In
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
