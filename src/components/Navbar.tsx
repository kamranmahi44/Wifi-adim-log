import React from 'react';
import { Radio, ExternalLink, LogOut, ArrowRightLeft } from 'lucide-react';
import { OntModelInfo } from '../types/ont';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  selectedModel: OntModelInfo;
  onOpenGatewayRedirect: () => void;
  activeDeviceCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isLoggedIn,
  onLogout,
  selectedModel,
  onOpenGatewayRedirect,
  activeDeviceCount
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'devices', label: `Devices (${activeDeviceCount})` },
    { id: 'wifi', label: 'WLAN & WiFi' },
    { id: 'gateway', label: 'Gateway & Redirect' },
    { id: 'diagnostics', label: 'Diagnostics' },
    { id: 'security', label: 'Management' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('overview');
            }}
            className="text-lg font-bold tracking-tight text-white hover:text-sky-300 transition-colors whitespace-nowrap"
          >
            NetONT Gateway
          </a>
          <span className="hidden lg:inline text-xs text-slate-500 font-mono">
            {selectedModel.defaultIp}
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        {isLoggedIn ? (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-sky-400 border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
            <span>Model: {selectedModel.hardwareModel}</span>
            <span aria-hidden="true">·</span>
            <span>Gateway: {selectedModel.defaultIp}</span>
          </div>
        )}

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenGatewayRedirect}
            title="Open or redirect to local physical ONT Gateway IP (192.168.1.1)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Connect Local IP</span>
            <span className="sm:hidden">IP Redirect</span>
          </button>

          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium rounded-lg border border-rose-500/20 transition-colors whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('gateway')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Scan Network</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav bar when logged in */}
      {isLoggedIn && (
        <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 no-scrollbar gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                currentTab === item.id
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
