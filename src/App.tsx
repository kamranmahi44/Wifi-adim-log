import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OntLogin } from './components/OntLogin';
import { OverviewTab } from './components/OverviewTab';
import { DevicesTab } from './components/DevicesTab';
import { WifiConfigTab } from './components/WifiConfigTab';
import { DiagnosticsTab } from './components/DiagnosticsTab';
import { SystemSecurityTab } from './components/SystemSecurityTab';
import { GatewayView } from './components/GatewayView';
import { GatewayRedirectModal } from './components/GatewayRedirectModal';
import {
  ONT_PRESETS,
  DEFAULT_OPTICAL_METRICS,
  DEFAULT_WAN_STATUS,
  DEFAULT_DEVICES,
  DEFAULT_WIFI_SETTINGS
} from './data/defaultData';
import { OntModelInfo, ConnectedDevice, WifiSettings, OpticalMetrics, WanStatus } from './types/ont';
import { RotateCw, CheckCircle2, ShieldCheck, Radio } from 'lucide-react';

export default function App() {
  const [selectedModel, setSelectedModel] = useState<OntModelInfo>(ONT_PRESETS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'telecomadmin' | 'user'>('admin');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [currentGatewayIp, setCurrentGatewayIp] = useState(selectedModel.defaultIp);

  // Core network state
  const [opticalMetrics, setOpticalMetrics] = useState<OpticalMetrics>(DEFAULT_OPTICAL_METRICS);
  const [wanStatus, setWanStatus] = useState<WanStatus>(DEFAULT_WAN_STATUS);
  const [devices, setDevices] = useState<ConnectedDevice[]>(DEFAULT_DEVICES);
  const [wifiSettings, setWifiSettings] = useState<WifiSettings>(DEFAULT_WIFI_SETTINGS);

  // Reboot simulation state
  const [isRebooting, setIsRebooting] = useState(false);
  const [rebootSeconds, setRebootSeconds] = useState(20);
  const [rebootStepText, setRebootStepText] = useState('Restarting system firmware...');

  const handleLoginSuccess = (role: 'admin' | 'telecomadmin' | 'user') => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentTab('overview');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentTab('overview');
  };

  const handleModelChange = (model: OntModelInfo) => {
    setSelectedModel(model);
    setCurrentGatewayIp(model.defaultIp);
  };

  const handleUpdateDevice = (updated: ConnectedDevice) => {
    setDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleAddDevice = (device: ConnectedDevice) => {
    setDevices((prev) => [device, ...prev]);
  };

  const handleSaveWifi = (newSettings: WifiSettings) => {
    setWifiSettings(newSettings);
  };

  const handleStartReboot = () => {
    setIsRebooting(true);
    setRebootSeconds(20);
    setRebootStepText('Power-cycling optical transceiver...');

    const interval = setInterval(() => {
      setRebootSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRebooting(false);
          return 0;
        }

        if (prev === 15) setRebootStepText('Negotiating GPON O3 / O4 serial number...');
        if (prev === 10) setRebootStepText('Registering with ISP OLT (O5 Operational state)...');
        if (prev === 5) setRebootStepText('Initializing 2.4 GHz & 5 GHz wireless beacons...');

        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      
      {/* Universal Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'gateway' && !isLoggedIn) {
            setIsGatewayModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        selectedModel={selectedModel}
        onOpenGatewayRedirect={() => setIsGatewayModalOpen(true)}
        activeDeviceCount={devices.filter((d) => !d.isBlocked).length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Reboot Overlay Modal */}
        {isRebooting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin" />
                <RotateCw className="w-8 h-8 text-sky-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Rebooting {selectedModel.name}</h3>
                <p className="text-xs font-mono text-sky-400 mt-2">{rebootStepText}</p>
                <div className="mt-4 font-mono text-3xl font-bold text-white">
                  {rebootSeconds}s
                </div>
              </div>

              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-1000"
                  style={{ width: `${((20 - rebootSeconds) / 20) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500">
                Please do not disconnect power or optical fiber cable during restart.
              </p>
            </div>
          </div>
        )}

        {/* View Switcher */}
        {!isLoggedIn ? (
          <OntLogin
            selectedModel={selectedModel}
            onSelectModel={handleModelChange}
            onLoginSuccess={handleLoginSuccess}
            onOpenGatewayRedirect={() => setIsGatewayModalOpen(true)}
          />
        ) : (
          <div>
            {currentTab === 'overview' && (
              <OverviewTab
                selectedModel={selectedModel}
                opticalMetrics={opticalMetrics}
                wanStatus={wanStatus}
                connectedDeviceCount={devices.filter((d) => !d.isBlocked).length}
                onOpenGatewayRedirect={() => setIsGatewayModalOpen(true)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'devices' && (
              <DevicesTab
                devices={devices}
                onUpdateDevice={handleUpdateDevice}
                onAddDevice={handleAddDevice}
                gatewayIp={currentGatewayIp}
              />
            )}

            {currentTab === 'wifi' && (
              <WifiConfigTab
                wifiSettings={wifiSettings}
                onSaveSettings={handleSaveWifi}
              />
            )}

            {currentTab === 'gateway' && (
              <GatewayView
                currentGatewayIp={currentGatewayIp}
                onSelectGatewayIp={(ip) => setCurrentGatewayIp(ip)}
              />
            )}

            {currentTab === 'diagnostics' && (
              <DiagnosticsTab gatewayIp={currentGatewayIp} />
            )}

            {currentTab === 'security' && (
              <SystemSecurityTab
                selectedModel={selectedModel}
                onReboot={handleStartReboot}
              />
            )}
          </div>
        )}
      </main>

      {/* Local Gateway IP Redirect Modal */}
      <GatewayRedirectModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
        currentGatewayIp={currentGatewayIp}
        onSelectGatewayIp={(ip) => setCurrentGatewayIp(ip)}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>NetONT Local Optical Gateway Administrator</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{selectedModel.hardwareModel}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Gateway: <strong className="font-mono text-slate-300">{currentGatewayIp}</strong></span>
            <button
              onClick={() => setIsGatewayModalOpen(true)}
              className="text-sky-400 hover:text-sky-300 hover:underline"
            >
              IP Redirect Tool
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
