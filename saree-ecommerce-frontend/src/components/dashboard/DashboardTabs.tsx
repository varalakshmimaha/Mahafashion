import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { User, Package, MapPin, MessageSquare } from 'lucide-react';

const DashboardTabs: React.FC = () => {
    const location = useLocation();

    const tabs = [
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'My Orders', path: '/orders', icon: Package },
        { name: 'Addresses', path: '/addresses', icon: MapPin },
        { name: 'My Queries', path: '/queries', icon: MessageSquare },
    ];

    return (
        <div className="mb-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    const Icon = tab.icon;
                    return (
                        <NavLink
                            key={tab.name}
                            to={tab.path}
                            className={({ isActive }) =>
                                `
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                ${isActive
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                `
                            }
                            // Use inline style for dynamic active color if needed, but class based is cleaner
                            style={({ isActive }) => isActive ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' } : {}}
                        >
                            <Icon size={18} />
                            {tab.name}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};

export default DashboardTabs;
