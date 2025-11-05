import React, { useState, useEffect, useCallback } from 'react';

// --- Import the real page components ---
import DashboardPage from './pages/DashboardPage.jsx';

// --- Icon Components ---
const IconDashboard = () => <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;

// --- Data for Navigation ---
const navItems = [
    { name: 'Dashboard', icon: <IconDashboard /> },

];

// --- Sidebar Component ---
const Sidebar = ({ activePage, setActivePage, settings }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});
    useEffect(() => { if (isCollapsed) setOpenSubmenus({}); }, [isCollapsed]);
    const handleToggleSubmenu = (menuName) => { if (!isCollapsed) setOpenSubmenus(prev => ({ ...prev, [menuName]: !prev[menuName] })); };
    
    const addressSubtitle = settings?.address?.split('\n')[0] || 'Application';

    return (
        <nav className={`flex flex-col text-white transition-all duration-300 ease-in-out flex-shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`} style={{ backgroundColor: '#31708E' }}>
            <div className="flex items-center p-4 border-b border-white/10 h-[65px] overflow-hidden">
                <div className="flex-shrink-0"><IconLogo /></div>
                {!isCollapsed && (<div className="ml-3 whitespace-nowrap"><p className="font-bold text-lg">{settings?.company_name || 'Pharma App'}</p><p className="text-xs text-gray-300">{addressSubtitle}</p></div>)}
            </div>
            <ul className="flex flex-col p-2 space-y-1 flex-grow overflow-y-auto">
                {navItems.map((item) => (
                    <li key={item.name}>
                        {item.submenu ? (
                            <>
                                <button onClick={() => handleToggleSubmenu(item.name)} className="w-full flex items-center justify-between p-3 rounded-md hover:bg-white/10 transition-colors text-left">
                                    <span className="flex items-center">{item.icon}{!isCollapsed && <span className="ml-3 whitespace-nowrap">{item.name}</span>}</span>
                                    {!isCollapsed && <IconChevronDown className={`transition-transform ${openSubmenus[item.name] ? 'rotate-180' : ''}`} />}
                                </button>
                                <ul className={`overflow-hidden transition-all duration-300 ease-in-out ${openSubmenus[item.name] ? 'max-h-40' : 'max-h-0'}`}>
                                    {item.submenu.map(subItem => (<li key={subItem.name}><a href="#" onClick={(e) => { e.preventDefault(); setActivePage(subItem.name); }} className={`flex items-center p-2 rounded-md hover:bg-white/10 transition-colors ml-6 ${activePage === subItem.name ? 'bg-white/10' : ''}`}>{!isCollapsed && <span className="whitespace-nowrap text-sm">{subItem.name}</span>}</a></li>))}
                                </ul>
                            </>
                        ) : (<a href="#" onClick={(e) => { e.preventDefault(); setActivePage(item.name); }} className={`flex items-center p-3 rounded-md hover:bg-white/10 transition-colors ${activePage === item.name ? 'bg-white/10' : ''}`}>{item.icon}{!isCollapsed && <span className="ml-3 whitespace-nowrap">{item.name}</span>}</a>)}
                    </li>
                ))}
            </ul>
            <div className="p-2 border-t border-white/10">
                <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('Settings'); }} className={`flex items-center w-full p-3 rounded-md hover:bg-white/10 transition-colors ${activePage === 'Settings' ? 'bg-white/10' : ''}`}><IconSettings />{!isCollapsed && <span className="ml-3 whitespace-nowrap">Settings</span>}</a>
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="flex items-center w-full p-3 rounded-md hover:bg-white/10 transition-colors"><IconCollapse className={isCollapsed ? 'rotate-180' : ''}/>{!isCollapsed && <span className="ml-3 whitespace-nowrap">Collapse</span>}</button>
            </div>
        </nav>
    );
};

// --- MainContent Component ---
const MainContent = ({ page, setActivePage, onSettingsUpdate }) => {
    const renderPage = () => {
        switch (page) {
            case 'Dashboard': return <DashboardPage setActivePage={setActivePage} />;
            default: return <div>Coming Soon</div>;
        }
    };
    return (
        <main className="flex-1 overflow-auto bg-[#E9E9E9] p-6">
            <h1 className="text-3xl font-bold text-gray-800">{page}</h1>
            <div className="border-b-2 border-gray-300 mt-2 mb-6"></div>
            {renderPage()}
        </main>
    );
};

// --- Main App Component ---
export default function App() {
    const [activePage, setActivePage] = useState('Dashboard');
    const [settings, setSettings] = useState(null);

    const fetchSettings = useCallback(async () => {
        try {
            const response = await fetch('/api/settings');
            if(response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (err) {
            console.error("Failed to fetch settings for app:", err);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return (
        <div className="flex flex-row h-screen w-screen overflow-hidden">
            <Sidebar activePage={activePage} setActivePage={setActivePage} settings={settings} />
            <MainContent page={activePage} setActivePage={setActivePage} onSettingsUpdate={fetchSettings} />
        </div>
    );
}