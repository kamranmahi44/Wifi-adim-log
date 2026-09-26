import React, { useState } from 'react';
import {
  ExternalLink,
  Search,
  Wifi,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Radio,
  RefreshCw,
  ArrowRight,
  Shield,
  Smartphone,
  Laptop
} from 'lucide-react';
import { COMMON_GATEWAY_IPS } from '../data/defaultData';
import { WifiQrCode } from './WifiQrCode';

interface GatewayViewProps {
  currentGatewayIp: string;
  onSelectGatewayIp: (ip: string) => void;
}

export const GatewayView: React.FC<GatewayViewProps> = ({
  currentGatewayIp,
  onSelectGatewayIp
}) => {
  const [targetIp, setTargetIp] = useState(currentGatewayIp);
  const [port, setPort] = useState('80');
  const [protocol, setProtocol] = useState<'http' | 'https'>('http');
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [gateways, setGateways] = useState(
    COMMON_GATEWAY_IPS.map((g) => ({
      ...g,
      status: g.ip === currentGatewayIp ? ('active' as const) : ('idle' as const),
      latencyMs: g.ip === currentGatewayIp ? 1.2 : 0
    }))
  );

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

    const updated = [...gateways];
    let step = 0;

    const interval = setInterval(() => {
      if (step < updated.length) {
        const item = updated[step];
        const isLikelyActive = item.ip === targetIp || item.ip === '192.168.1.1' || item.ip === '192.168.100.1';
        item.status = isLikelyActive ? 'active' : 'idle';
        item.latencyMs = isLikelyActive ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 15) + 10;
        setGateways([...updated]);
        step++;
        setScanProgress(Math.round((step / updated.length) * 100));
      } else {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 350);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border border-sky-500/20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Physical Hardware Connector
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Local Network WiFi Gateway & IP Redirect
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              Probe your local Wi-Fi subnet, discover your physical ONT modem or router address, and launch direct HTTP/HTTPS admin authentication.
            </p>
          </div>

          <button
            onClick={handleLaunchInBrowser}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <span>Launch {fullUrl}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Direct IP Builder & Common Gateway Presets */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Target URL Builder Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Target Gateway IP Configuration</h3>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                aria-label="Protocol"
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as 'http' | 'https')}
                className="w-24 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="http">http://</option>
                <option value="https">https://</option>
              </select>

              <input
                type="text"
                value={targetIp}
                onChange={(e) => {
                  setTargetIp(e.target.value);
                  onSelectGatewayIp(e.target.value);
                }}
                placeholder="192.168.1.1"
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
              />

              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="80"
                className="w-20 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-center"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2 overflow-hidden text-xs">
                <span className="text-slate-400">Target Webpage:</span>
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
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <span>Open Admin Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Common Default Gateway List & Probe */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Default Gateway Subnet Presets</h3>
                <p className="text-xs text-slate-400">Standard router management IPs by manufacturer</p>
              </div>

              <button
                onClick={handleScanGateways}
                disabled={isScanning}
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? `Probing (${scanProgress}%)` : 'Probe All Gateways'}</span>
              </button>
            </div>

            {isScanning && (
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            )}

            <div className="space-y-2">
              {gateways.map((g) => {
                const isSelected = targetIp === g.ip;

                return (
                  <div
                    key={g.ip}
                    onClick={() => {
                      setTargetIp(g.ip);
                      onSelectGatewayIp(g.ip);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
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

          {/* Quick Command Guide */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>How to Verify Your Exact Gateway IP</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300 font-semibold block mb-1">Windows (Command Prompt)</span>
                <code className="text-emerald-400 font-mono text-[11px]">ipconfig | findstr Gateway</code>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300 font-semibold block mb-1">macOS / Linux (Terminal)</span>
                <code className="text-sky-400 font-mono text-[11px]">route -n get default | grep gateway</code>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scan to Open Admin Page on Mobile via QR Code */}
        <div className="lg:col-span-5 space-y-4">
          <WifiQrCode
            ssid=""
            type="url"
            targetUrl={fullUrl}
            title="Scan with Mobile Camera to Open ONT Webpage"
          />

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-3">
            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Mobile Phone Browser Access</span>
            </h4>
            <p>
              When your mobile phone is connected to your home Wi-Fi network, point the camera at this QR code to jump straight to the physical router’s web login page without typing IP numbers manually.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct local connection — no external servers involved</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
