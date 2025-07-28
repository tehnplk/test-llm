'use client';

import { useState } from 'react';

interface SidebarProps {
    title: string;
}

export default function Sidebar({ title }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            <aside 
                className={`bg-white h-screen fixed left-0 top-0 border-r border-gray-200 shadow-sm transition-all duration-300 
                    ${isCollapsed ? 'w-16' : 'w-64'}`}
            >
                <div className="p-4 relative">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                        <h1 className={`text-xl font-bold text-gray-800 transition-all duration-300 mb-8
                            ${isCollapsed ? 'hidden' : 'block'}`}>
                            {title}
                        </h1>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <span className="material-icons">
                                {isCollapsed ? 'chevron_right' : 'chevron_left'}
                            </span>
                        </button>
                    </div>
                    <nav className="space-y-2">
                        <a href="/" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons">chat</span>
                            <span className={`ml-2 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                                Chat
                            </span>
                        </a>
                        <a href="/dashboard" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons">dashboard</span>
                            <span className={`ml-2 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                                Dashboard
                            </span>
                        </a>
                        <a href="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                            <span className="material-icons">settings</span>
                            <span className={`ml-2 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                                Settings
                            </span>
                        </a>
                    </nav>
                </div>
            </aside>
            <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
            </div>
        </>
    );
}
