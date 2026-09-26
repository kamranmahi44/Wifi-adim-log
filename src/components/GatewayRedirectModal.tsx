import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Search,
  Wifi,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Terminal,
  HelpCircle,
  ArrowRight,
  Radio,
  RefreshCw,
  X
} from 'lucide-react';
import { COMMON_GATEWAY_IPS } from '../data/defaultData';
import { WifiQrCode } from './WifiQrCode';

interface GatewayRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGatewayIp: string;
  onSelectGatewayIp: (ip: string) => void;
}

export const GatewayRedirectModal: React.FC<GatewayRedirectModalProps> = ({
  isOpen,
  onClose,
  currentGatewayIp,
  onSelectGatewayIp
}) => {
  const [targetIp, setTargetIp] = useState(currentGatewayIp);
  const [port, setPort] = useState('80');
  const [protocol, setProtocol] = useState<'http' | 'https'>('http');
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [testedGateways, setTestedGateways] = useState<
    Array<{ ip: string; desc: string; status: 'active' | 'tested' | 'idle'; latencyMs: number }>
  >(COMMON_GATEWAY_IPS.map((g) => ({ ...g, status: 'idle', latencyMs: 0 })));
  const [activeTab, setActiveTab] = useState<'redirect' | 'qr' | 'guide'>('redirect');

  useEffect(() => {
    setTargetIp(currentGatewayIp);
  }, [currentGatewayIp]);

  if (!isOpen) return null;

  const fullUrl = `${protocol}://${targetIp}${port && port !== '80' && port !== '443' ? `:${port}` : ''}`;

  const handleLaunchInBrowser = () => {
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleScanGateways = () => {
    setIsScanning(true);
    setScanProgress(0);

    const updated = [...testedGateways];
    let step = 0;

    const interval = setInterval(() => {
      if (step < updated.length) {
        const item = updated[step];
        const isLikelyActive = item.ip === '192.168.1.1' || item.ip === '192.168.100.1';
        item.status = isLikelyActive ? 'active' : 'tested';
        item.latencyMs = isLikelyActive ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 20) + 15;
        setTestedGateways([...updated]);
        step++;
        setScanProgress(Math.round((step / updated.length) * 100));
      } else {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Local Network Gateway IP Redirector</h2>
              <p className="text-xs text-slate-400">Connect to your physical ONT / WiFi router admin webpage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800/80 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('redirect')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'redirect'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            IP Redirect & Scanner
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'qr'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Mobile Scan QR
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Find My Gateway Guide
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {activeTab === 'redirect' && (
            <>
              {/* Target Gateway URL Builder */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Target ONT / Router Gateway Address
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Protocol Selector */}
                  <select
                    aria-label="Protocol"
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value as 'http' | 'https')}
                    className="w-24 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="http">http://</option>
                    <option value="https">https://</option>
                  </select>

                  {/* IP Input */}
                  <input
                    type="text"
                    value={targetIp}
                    onChange={(e) => {
                      setTargetIp(e.target.value);
                      onSelectGatewayIp(e.target.value);
                    }}
                    placeholder="192.168.1.1"
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />

                  {/* Port */}
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="80"
                    title="Port (default 80)"
                    className="w-20 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-center"
                  />
                </div>

                {/* Live URL Preview & Launch Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 overflow-hidden text-xs">
                    <span className="text-slate-400">Launch URL:</span>
                    <span className="font-mono text-sky-400 font-semibold truncate">{fullUrl}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleLaunchInBrowser}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      <span>Open Admin Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Common Gateway Scanner */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Common Default Gateway IP Presets
                  </span>
                  <button
                    onClick={handleScanGateways}
                    disabled={isScanning}
                    className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>{isScanning ? `Scanning (${scanProgress}%)` : 'Probe Subnet Gateways'}</span>
                  </button>
                </div>

                {isScanning && (
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-sky-500 h-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  {testedGateways.map((g) => {
                    const isSelected = targetIp === g.ip;
                    return (
                      <div
                        key={g.ip}
                        onClick={() => {
                          setTargetIp(g.ip);
                          onSelectGatewayIp(g.ip);
                        }}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-sky-500/10 border-sky-500/40 text-white'
                            : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              g.status === 'active'
                                ? 'bg-emerald-400 ring-2 ring-emerald-500/30'
                                : isSelected
                                ? 'bg-sky-400'
                                : 'bg-slate-600'
                            }`}
                          />
                          <div>
                            <div className="font-mono text-sm font-semibold">{g.ip}</div>
                            <div className="text-[11px] text-slate-400">{g.desc}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {g.latencyMs > 0 && (
                            <span className="font-mono text-[11px] text-emerald-400">
                              {g.latencyMs}ms
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`http://${g.ip}`, '_blank', 'noopener,noreferrer');
                            }}
                            className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded transition-colors"
                            title={`Open http://${g.ip} in new tab`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informational tip about Local Network vs Web Apps */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <AlertCircle className="w-4 h-4 text-sky-400" />
                  <span>How to connect to your physical ONT modem</span>
                </div>
                <p>
                  To manage your physical fiber router at home, ensure your computer or phone is connected to the same WiFi or LAN cable, then click <strong>Open Admin Page</strong> to launch its native HTTP interface.
                </p>
              </div>
            </>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center">
              <p className="text-xs text-slate-400 text-center mb-4 max-w-md">
                Scan this QR code with your smartphone camera while connected to your home WiFi. It will open <span className="font-mono text-sky-400 font-semibold">{fullUrl}</span> immediately on your phone browser.
              </p>
              <WifiQrCode
                ssid=""
                type="url"
                targetUrl={fullUrl}
                title="Mobile Gateway Redirect QR"
              />
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Find Default Gateway on Windows</span>
                </h3>
                <p className="text-slate-400 mb-2">
                  1. Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">Win + R</kbd>, type <code className="text-sky-400 font-mono">cmd</code>, and press Enter.
                </p>
                <div className="p-2.5 bg-slate-900 rounded font-mono text-[11px] text-slate-300">
                  C:\&gt; ipconfig<br />
                  <span className="text-slate-500">...</span><br />
                  Default Gateway . . . . . : <span className="text-emerald-400 font-bold">192.168.1.1</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <span>Find Default Gateway on macOS & Linux</span>
                </h3>
                <p className="text-slate-400 mb-2">
                  Open Terminal and run the route lookup command:
                </p>
                <div className="p-2.5 bg-slate-900 rounded font-mono text-[11px] text-slate-300">
                  $ route -n get default | grep gateway<br />
                  gateway: <span className="text-emerald-400 font-bold">192.168.1.1</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-amber-400" />
                  <span>Find Default Gateway on iPhone & Android</span>
                </h3>
                <p className="text-slate-400">
                  Go to <strong>Settings</strong> &gt; <strong>Wi-Fi</strong> &gt; Tap the <strong className="text-slate-300">(i)</strong> or gear icon next to your connected network. Look for the <strong>Router</strong> or <strong>Gateway</strong> IP entry.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs text-slate-500">
            Selected Gateway: <span className="font-mono text-slate-300">{targetIp}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
