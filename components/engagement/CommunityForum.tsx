import React, { useState } from 'react';
import { MessageCircle, Heart, Share2, MoreVertical, User } from 'lucide-react';

export const CommunityForum: React.FC = () => {
    const [posts, setPosts] = useState([
        { id: 1, author: 'Sarah M.', avatar: 'https://randomuser.me/api/portraits/women/42.jpg', time: '2h ago', content: 'Just finished my first week of physical therapy for my knee. It was tough but feeling stronger already! 💪', likes: 24, comments: 5, topic: 'Recovery' },
        { id: 2, author: 'David K.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', time: '5h ago', content: 'Anyone has tips for managing glucose levels during holidays? The food temptation is real!', likes: 18, comments: 12, topic: 'Diabetes' },
    ]);

    const handleLike = (id: number) => {
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4 overflow-x-auto pb-2">
                {['All', 'Recovery', 'Diabetes', 'Pregnancy', 'Mental Health', 'Wellness'].map(topic => (
                    <button key={topic} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 whitespace-nowrap transition-colors">
                        {topic}
                    </button>
                ))}
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold"><User size={20} /></div>
                <input type="text" placeholder="Share your journey..." className="flex-grow bg-slate-50 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Post</button>
            </div>

            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h3 className="font-bold text-slate-800">{post.author}</h3>
                                    <p className="text-xs text-slate-400">{post.time} • <span className="text-indigo-500 font-bold">{post.topic}</span></p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:bg-slate-50 p-2 rounded-full"><MoreVertical size={20} /></button>
                        </div>
                        <p className="text-slate-700 mb-6 leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-6 border-t border-slate-50 pt-4">
                            <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors font-medium">
                                <Heart size={20} className={post.likes > 0 ? "fill-pink-50 text-pink-500" : ""} /> {post.likes}
                            </button>
                            <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors font-medium">
                                <MessageCircle size={20} /> {post.comments}
                            </button>
                            <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors font-medium ml-auto">
                                <Share2 size={20} /> Share
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
