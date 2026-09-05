"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../lib/store/app-store";
import { Bell, CheckCheck, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export const NotificationsDropdown: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/40 text-stone-700 dark:text-stone-200 transition-colors focus:outline-none"
        aria-label="View Notifications"
      >
        <Bell className="w-5 h-5 text-cyan-800 dark:text-cyan-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FAF7F0] dark:bg-[#082933] shadow-2xl border border-[#EAE3D5] dark:border-cyan-800 z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#F5EFE6] dark:bg-cyan-950/60 border-b border-[#EAE3D5] dark:border-cyan-800">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-stone-800 dark:text-stone-100">Agricultural Alerts</h4>
              {unreadCount > 0 && (
                <span className="bg-cyan-100 dark:bg-cyan-800 text-cyan-900 dark:text-cyan-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1"
                title="Clear all alerts"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#EAE3D5] dark:divide-cyan-900/50">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 dark:text-stone-400">
                No active notifications. All your farm operations are up to date.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 transition-colors cursor-pointer hover:bg-cyan-50/70 dark:hover:bg-cyan-900/30 ${
                    !notif.read ? "bg-cyan-50/40 dark:bg-cyan-900/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-xs text-stone-900 dark:text-stone-100">
                      {notif.title}
                    </div>
                    <span className="text-[10px] text-stone-400 shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  {notif.link && (
                    <Link
                      href={notif.link}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold mt-2 hover:underline"
                    >
                      View details <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
