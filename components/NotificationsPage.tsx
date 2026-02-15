import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Clock, 
  Calendar, 
  FileText, 
  ShieldAlert, 
  Check, 
  Trash2 
} from 'lucide-react';
import { NotificationItem, ViewState } from '../types';

interface NotificationsPageProps {
  onNavigate: (view: ViewState) => void;
}

// Mock Data generator
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Appointment Reminder', message: 'You have a cardiology appointment tomorrow at 10:00 AM.', type: 'info', timestamp: '2 hours ago', read: false, actionUrl: 'appointments' },
  { id: 'n2', title: 'Lab Results Ready', message: 'Your Complete Blood Count results are now available.', type: 'success', timestamp: '5 hours ago', read: false, actionUrl: 'records' },
  { id: 'n3', title: 'Bill Payment Successful', message: 'Payment of $45.00 for Lab Work has been processed.', type: 'success', timestamp: '1 day ago', read: true },
  { id: 'n4', title: 'Security Alert', message: 'New login detected from Chrome on Windows.', type: 'warning', timestamp: '2 days ago', read: true, actionUrl: 'settings' },
  { id: 'n5', title: 'Flu Shot Reminder', message: 'It is time for your annual flu vaccination. Schedule now.', type: 'info', timestamp: '3 days ago', read: true, actionUrl: 'appointments' },
];

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts'>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'alerts') return n.type === 'warning' || n.type === 'alert';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-green-500" />;
      case 'warning': return <ShieldAlert size={20} className="text-amber-500" />;
      case 'alert': return <AlertCircle size={20} className="text-red-500" />;
      default: return <Info size={20} className="text-arya-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-100';
      case 'warning': return 'bg-amber-50 border-amber-100';
      case 'alert': return 'bg-red-50 border-red-100';
      default: return 'bg-white border-slate-100';
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 text-sm">Stay updated with your health journey.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleMarkAllRead} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Check size={16} />
            <span className="hidden md:inline">Mark all read</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-1 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${filter === 'all' ? 'border-arya-500 text-arya-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${filter === 'unread' ? 'border-arya-500 text-arya-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Unread
          {notifications.some(n => !n.read) && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">New</span>}
        </button>
        <button 
          onClick={() => setFilter('alerts')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${filter === 'alerts' ? 'border-arya-500 text-arya-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Alerts
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-5 rounded-2xl border shadow-sm transition-all relative group ${getBgColor(n.type)} ${!n.read ? 'border-l-4 border-l-arya-500' : ''}`}
            >
              <div className="flex gap-4">
                <div className="mt-1 bg-white p-2 rounded-full shadow-sm h-fit">
                  {getIcon(n.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-slate-800 ${!n.read ? 'text-lg' : 'text-base'}`}>
                      {n.title}
                      {!n.read && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock size={12} /> {n.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed max-w-2xl">{n.message}</p>
                  
                  <div className="flex gap-3 mt-4">
                    {n.actionUrl && (
                      <button 
                        onClick={() => { handleMarkAsRead(n.id); onNavigate(n.actionUrl!); }}
                        className="text-xs font-bold text-white bg-arya-600 px-4 py-2 rounded-lg hover:bg-arya-700 transition-colors"
                      >
                        View Details
                      </button>
                    )}
                    {!n.read && (
                      <button 
                        onClick={() => handleMarkAsRead(n.id)}
                        className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(n.id)}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-100">
            <Bell size={48} className="mb-4 opacity-20" />
            <p>No notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
