import React from 'react';
import { User, Mic, MicOff, Camera, CameraOff, PhoneOff } from 'lucide-react';
import { Appointment } from '../../types';

interface VideoCallOverlayProps {
  appointment: Appointment;
  isMuted: boolean;
  cameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}

export const VideoCallOverlay: React.FC<VideoCallOverlayProps> = ({
  appointment,
  isMuted,
  cameraOff,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative bg-slate-800">
        {/* Remote participant placeholder */}
        <div className="absolute inset-0 flex items-center justify-center text-white/50">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center overflow-hidden">
              <User size={64} />
            </div>
            <p className="text-xl font-bold">{appointment.doctorName}</p>
            <p>Connecting...</p>
          </div>
        </div>
        
        {/* Self view (PiP) */}
        <div className="absolute bottom-4 right-4 w-32 h-48 bg-black rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl">
          {!cameraOff ? (
            <div className="w-full h-full bg-slate-600 flex items-center justify-center">
              <User size={20} className="text-white"/>
            </div>
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs">
              Camera Off
            </div>
          )}
        </div>
      </div>
      
      {/* Control bar */}
      <div className="h-24 bg-slate-900 flex items-center justify-center gap-6">
        <button 
          onClick={onToggleMute} 
          className={`p-4 rounded-full transition-colors ${
            isMuted 
              ? 'bg-red-500 text-white' 
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </button>
        
        <button 
          onClick={onEndCall} 
          className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 px-8 flex items-center gap-2 font-bold"
        >
          <PhoneOff /> End
        </button>
        
        <button 
          onClick={onToggleCamera} 
          className={`p-4 rounded-full transition-colors ${
            cameraOff 
              ? 'bg-red-500 text-white' 
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
          title={cameraOff ? 'Turn camera on' : 'Turn camera off'}
        >
          {cameraOff ? <CameraOff /> : <Camera />}
        </button>
      </div>
    </div>
  );
};
