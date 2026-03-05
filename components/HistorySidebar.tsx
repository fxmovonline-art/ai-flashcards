"use client";

import React from "react";
import { format } from "date-fns";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface HistoryItem {
  id: string;
  title: string;
  createdAt: Date;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (id: string) => void;
  currentId?: string;
}

export default function HistorySidebar({ history, onSelect, currentId }: HistorySidebarProps) {
  const { data: session, status } = useSession();

  return (
    <div className="w-72 h-screen fixed left-0 top-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex flex-col z-40">
       <div className="mb-8 mt-16 px-2 flex flex-col h-full">
         
         {/* User Info Section */}
         <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
           {status === "loading" ? (
             <div className="h-10 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl" />
           ) : session ? (
             <div className="space-y-4">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs uppercase shadow-lg shadow-indigo-600/20">
                   {session.user?.name?.substring(0, 2) || "U"}
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-black text-slate-800 dark:text-white truncate">
                     {session.user?.name}
                   </p>
                   <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate lowercase">
                     {session.user?.email}
                   </p>
                 </div>
               </div>
               <button 
                onClick={() => signOut()}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 dark:hover:text-red-400 transition-all flex items-center justify-center space-x-2"
               >
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
                 <span>Sign Out</span>
               </button>
             </div>
           ) : (
             <div className="space-y-3">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-1">Guest Mode</p>
               <Link 
                href="/login"
                className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center text-xs font-black transition-all shadow-lg shadow-indigo-600/20"
               >
                 Sign In
               </Link>
               <p className="text-[10px] text-center text-slate-400 font-bold leading-relaxed px-2">
                 Sign in to save your history and sync across devices.
               </p>
             </div>
           )}
         </div>

         <div className="flex-1 flex flex-col min-h-0">
           <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 px-2">History</h2>
           <div className="space-y-2 overflow-y-auto pb-10 custom-scrollbar flex-1">
             {history.length === 0 ? (
               <div className="text-xs text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                 {session ? "No history yet. Generate some cards!" : "Personal history is only available for signed-in users."}
               </div>
             ) : (
               history.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => onSelect(item.id)}
                   className={`w-full text-left p-4 rounded-2xl transition-all group border-2 ${
                     currentId === item.id 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                      : "bg-white dark:bg-slate-950 border-transparent text-slate-600 dark:text-slate-400 hover:border-indigo-600/30 hover:bg-slate-50 dark:hover:bg-indigo-900/10"
                   }`}
                 >
                   <div className="flex flex-col gap-1">
                     <span className={`text-sm font-bold line-clamp-2 ${currentId === item.id ? "text-white" : "text-slate-800 dark:text-slate-200 group-hover:text-indigo-600"}`}>
                       {item.title}
                     </span>
                     <span className={`text-[10px] uppercase font-black tracking-widest ${currentId === item.id ? "text-indigo-200" : "text-slate-400 dark:text-slate-600"}`}>
                       {format(new Date(item.createdAt), "MMM d, yyyy · HH:mm")}
                     </span>
                   </div>
                 </button>
               ))
             )}
           </div>
         </div>
       </div>
    </div>
  );
}
