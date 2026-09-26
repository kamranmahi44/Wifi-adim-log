import React, { useState } from 'react';
import {
  Wifi,
  Radio,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  Check,
  QrCode,
  Shield,
  Smartphone,
  Timer,
  Sliders,
  Users
} from 'lucide-react';
import { WifiSettings, WifiBandConfig } from '../types/ont';
import { WifiQrCode } from './WifiQrCode';

interface WifiConfigTabProps {
  wifiSettings: WifiSettings;
  onSaveSettings: (settings: WifiSettings) => void;
}

export const WifiConfigTab: React.FC<WifiConfigTabProps> = ({
  wifiSettings,
  onSaveSettings
}) => {
  const [config, setConfig] = useState<WifiSettings>(wifiSettings);
  const [activeBand, setActiveBand] = useState<'2.4' | '5.0' | 'guest'>('5.0');
  const [showPassword24, setShowPassword24] = useState(false);
  const [showPassword50, setShowPassword50] = useState(false);
  const [showPasswordGuest, setShowPasswordGuest] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [wpsSecondsRemaining, setWpsSecondsRemaining] = useState(0);

  const handleUpdateBand24 = (field: keyof WifiBandConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      band24: { ...prev.band24, [field]: value }
    }));
  };

  const handleUpdateBand50 = (field: keyof WifiBandConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      band50: { ...prev.band50, [field]: value }
    }));
  };

  const handleUpdateGuest = (field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      guestWifi: { ...prev.guestWifi, [field]: value }
    }));
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let result = '';
    for (let i = 0; i < 14; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleStartWps = () => {
    setWpsSecondsRemaining(120);
    const interval = setInterval(() => {
      setWpsSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSave = () => {
    onSaveSettings(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Determine current active SSID & password for QR code
  const currentQrConfig = activeBand === '5.0'
    ? { ssid: config.band50.ssid, password: config.band50.password, sec: config.band50.securityMode, hidden: !config.band50.broadcastSsid }
    : activeBand === '2.4'
    ? { ssid: config.band24.ssid, password: config.band24.password, sec: config.band24.securityMode, hidden: !config.band24.broadcastSsid }
    : { ssid: config.guestWifi.ssid, password: config.guestWifi.password, sec: 'WPA2-PSK', hidden: false };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Band Switcher */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Wireless Local Area Network (WLAN)</h2>
          <p className="text-xs text-slate-400">Configure dual-band 2.4 GHz, 5 GHz Wi-Fi, and Guest Hotspot</p>
        </div>

        {/* Band Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveBand('5.0')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeBand === '5.0' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5 GHz Ultra
          </button>
          <button
            onClick={() => setActiveBand('2.4')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeBand === '2.4' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2.4 GHz Long-Range
          </button>
          <button
            onClick={() => setActiveBand('guest')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeBand === 'guest' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Guest Network
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: WiFi Settings Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          
          {/* Active Band Form */}
          {activeBand === '5.0' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">5 GHz Wi-Fi (High Speed / 802.11ac/ax)</h3>
                    <span className="text-[11px] text-slate-400">Low interference, ideal for 4K streaming and gaming</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.band50.enabled}
                    onChange={(e) => handleUpdateBand50('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600" />
                </label>
              </div>

              {/* SSID */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  5 GHz Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={config.band50.ssid}
                  onChange={(e) => handleUpdateBand50('ssid', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Wi-Fi Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => handleUpdateBand50('password', generateStrongPassword())}
                    className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword50 ? 'text' : 'password'}
                    value={config.band50.password}
                    onChange={(e) => handleUpdateBand50('password', e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    aria-label={showPassword50 ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword50(!showPassword50)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword50 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Mode & Channel Width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Security Mode
                  </label>
                  <select
                    aria-label="5 GHz Security Mode"
                    value={config.band50.securityMode}
                    onChange={(e) => handleUpdateBand50('securityMode', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="WPA2-PSK">WPA2-PSK (AES) Recommended</option>
                    <option value="WPA3-Personal">WPA3-Personal (SAE)</option>
                    <option value="WPA/WPA2-PSK">WPA/WPA2 Mixed</option>
                    <option value="Open">Open (No Password)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Channel Bandwidth
                  </label>
                  <select
                    aria-label="5 GHz Channel Bandwidth"
                    value={config.band50.bandwidth}
                    onChange={(e) => handleUpdateBand50('bandwidth', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="80MHz">80 MHz (High Throughput)</option>
                    <option value="160MHz">160 MHz (Ultra Gigabit)</option>
                    <option value="40MHz">40 MHz</option>
                    <option value="20MHz">20 MHz</option>
                  </select>
                </div>
              </div>

              {/* Options */}
              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.band50.broadcastSsid}
                    onChange={(e) => handleUpdateBand50('broadcastSsid', e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Broadcast SSID (Visible to nearby devices)</span>
                </label>
              </div>
            </div>
          )}

          {activeBand === '2.4' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">2.4 GHz Wi-Fi (Long Range / 802.11b/g/n)</h3>
                    <span className="text-[11px] text-slate-400">Maximum wall penetration, compatible with IoT devices</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.band24.enabled}
                    onChange={(e) => handleUpdateBand24('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  2.4 GHz Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={config.band24.ssid}
                  onChange={(e) => handleUpdateBand24('ssid', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Wi-Fi Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => handleUpdateBand24('password', generateStrongPassword())}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword24 ? 'text' : 'password'}
                    value={config.band24.password}
                    onChange={(e) => handleUpdateBand24('password', e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    aria-label={showPassword24 ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword24(!showPassword24)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword24 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Channel (Frequency)
                  </label>
                  <select
                    aria-label="2.4 GHz Channel"
                    value={config.band24.channel}
                    onChange={(e) => handleUpdateBand24('channel', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="auto">Auto (Best Interference Avoidance)</option>
                    <option value="1">Channel 1 (2.412 GHz)</option>
                    <option value="6">Channel 6 (2.437 GHz)</option>
                    <option value="11">Channel 11 (2.462 GHz)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Channel Bandwidth
                  </label>
                  <select
                    aria-label="2.4 GHz Channel Bandwidth"
                    value={config.band24.bandwidth}
                    onChange={(e) => handleUpdateBand24('bandwidth', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="20MHz">20 MHz (Best Stability for IoT)</option>
                    <option value="40MHz">40 MHz (Higher Speed)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.band24.broadcastSsid}
                    onChange={(e) => handleUpdateBand24('broadcastSsid', e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Broadcast SSID (Visible to nearby devices)</span>
                </label>
              </div>
            </div>
          )}

          {activeBand === 'guest' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Guest Wi-Fi Hotspot</h3>
                    <span className="text-[11px] text-slate-400">Isolated network prevents visitors from accessing LAN devices</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.guestWifi.enabled}
                    onChange={(e) => handleUpdateGuest('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Guest SSID
                </label>
                <input
                  type="text"
                  value={config.guestWifi.ssid}
                  onChange={(e) => handleUpdateGuest('ssid', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Guest Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswordGuest ? 'text' : 'password'}
                    value={config.guestWifi.password}
                    onChange={(e) => handleUpdateGuest('password', e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    aria-label={showPasswordGuest ? "Hide password" : "Show password"}
                    onClick={() => setShowPasswordGuest(!showPasswordGuest)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPasswordGuest ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.guestWifi.isolation}
                    onChange={(e) => handleUpdateGuest('isolation', e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Client AP Isolation (Guests cannot see or communicate with each other)</span>
                </label>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Changes apply instantly to ONT wireless radios
            </span>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-lg shadow-sm transition-colors"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Settings Applied!' : 'Apply Wireless Settings'}</span>
            </button>
          </div>

          {/* WPS Section */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-white">Wi-Fi Protected Setup (WPS)</span>
              <p className="text-[11px] text-slate-400">Connect printers, extenders, and phones without typing passwords</p>
            </div>

            <button
              onClick={handleStartWps}
              disabled={wpsSecondsRemaining > 0}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                wpsSecondsRemaining > 0
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${wpsSecondsRemaining > 0 ? 'animate-ping' : ''}`} />
              <span>{wpsSecondsRemaining > 0 ? `Pairing (${wpsSecondsRemaining}s)` : 'Push WPS Button'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Scan to Connect QR Code */}
        <div className="lg:col-span-5 space-y-4">
          <WifiQrCode
            ssid={currentQrConfig.ssid}
            password={currentQrConfig.password}
            securityMode={currentQrConfig.sec}
            hiddenSsid={currentQrConfig.hidden}
            type="wifi"
            title={`Scan to Join ${activeBand === '5.0' ? '5 GHz' : activeBand === '2.4' ? '2.4 GHz' : 'Guest'} Network`}
          />

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Instant QR Scan Connection</span>
            </div>
            <p>
              Users do not need to manually enter the Wi-Fi password. Open any smartphone camera, point it at this QR code, and tap <strong>Join Network</strong> to automatically link to <strong className="text-slate-200">{currentQrConfig.ssid}</strong>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
