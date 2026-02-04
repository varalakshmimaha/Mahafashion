import React, { useState, useEffect } from 'react';
import { socialMediaAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import {
    Plus, Trash2, Save, GripVertical,
    Facebook, Instagram, Twitter, Linkedin, Youtube,
    MessageCircle, Globe, Link as LinkIcon
} from 'lucide-react';

// Map of available icons
const ICON_MAP: Record<string, React.ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    whatsapp: MessageCircle,
    globe: Globe,
    link: LinkIcon
};

interface SocialLink {
    id: number;
    platform: string;
    url: string;
    icon: string;
    sort_order: number;
}

const SocialMediaSettings: React.FC = () => {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();

    // New link form state
    const [newPlatform, setNewPlatform] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newIcon, setNewIcon] = useState('globe');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const data = await socialMediaAPI.getAll();
            setLinks(data);
        } catch (error) {
            console.error('Failed to fetch social links:', error);
            addNotification('Failed to load social links', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlatform || !newUrl) return;

        try {
            const newLink = await socialMediaAPI.create({
                platform: newPlatform,
                url: newUrl,
                icon: newIcon,
                sort_order: links.length
            });

            setLinks([...links, newLink.link]);
            setNewPlatform('');
            setNewUrl('');
            setNewIcon('globe');
            setIsAdding(false);
            addNotification('Social link added successfully', 'success');
        } catch (error) {
            console.error('Failed to add link:', error);
            addNotification('Failed to add social link', 'error');
        }
    };

    const handleDeleteLink = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;

        try {
            await socialMediaAPI.delete(id);
            setLinks(links.filter(l => l.id !== id));
            addNotification('Social link deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete link:', error);
            addNotification('Failed to delete social link', 'error');
        }
    };

    if (loading) return <div>Loading social links...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium"
                >
                    <Plus size={16} />
                    {isAdding ? 'Cancel' : 'Add New Link'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddLink} className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                            <input
                                type="text"
                                value={newPlatform}
                                onChange={(e) => setNewPlatform(e.target.value)}
                                placeholder="e.g. My Blog"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                            <input
                                type="url"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(ICON_MAP).map((iconKey) => {
                                const Icon = ICON_MAP[iconKey];
                                return (
                                    <button
                                        key={iconKey}
                                        type="button"
                                        onClick={() => setNewIcon(iconKey)}
                                        className={`p-2 rounded-md border transition-all ${newIcon === iconKey
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                                            }`}
                                        title={iconKey}
                                    >
                                        <Icon size={20} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
                        >
                            <Save size={16} />
                            Save Link
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-2">
                {links.length === 0 && !isAdding && (
                    <p className="text-gray-500 italic text-center py-4">No social media links yet. Click "Add New Link" to create one.</p>
                )}

                {links.map((link) => {
                    const Icon = ICON_MAP[link.icon] || Globe;
                    return (
                        <div key={link.id} className="flex items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm group">
                            <div className="mr-3 text-gray-400 cursor-move">
                                <GripVertical size={16} />
                            </div>
                            <div className="p-2 bg-gray-50 rounded-full mr-3 text-gray-600">
                                <Icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{link.platform}</h4>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-primary truncate block max-w-[200px] sm:max-w-md">
                                    {link.url}
                                </a>
                            </div>
                            <button
                                onClick={() => handleDeleteLink(link.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SocialMediaSettings;
