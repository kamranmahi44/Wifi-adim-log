import React from 'react';
import {
  Activity,
  ArrowDownUp,
  Cpu,
  Globe,
  Radio,
  Server,
  Shield,
  Thermometer,
  Zap,
  CheckCircle2,
  ExternalLink,
  Wifi,
  Laptop
} from 'lucide-react';
import { OntModelInfo, OpticalMetrics, WanStatus } from '../types/ont';

interface OverviewTabProps {
  selectedModel: OntModelInfo;
  opticalMetrics: OpticalMetrics;
  wanStatus: WanStatus;
  connectedDeviceCount: number;
  onOpenGatewayRedirect: () => void;
  onNavigateTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  selectedModel,
  opticalMetrics,
  wanStatus,
  connectedDeviceCount,
  onOpenGatewayRedirect,
  onNavigateTab
}) => {
  // Format uptime
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  // Optical power status assessment
  const isRxGood = opticalMetrics.rxPower >= -27 && opticalMetrics.rxPower <= -8;
  const isTxGood = opticalMetrics.txPower >= 0.5 && opticalMetrics.txPower <= 5.0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Device & Link Status */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                PON Link: Operational (State O5)
              </span>
              <span className="text-xs text-slate-500 font-mono">
                GPON Class B+
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {selectedModel.name} · {selectedModel.hardwareModel}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              <span>Gateway IP: <strong className="font-mono text-slate-200">{selectedModel.defaultIp}</strong></span>
              <span aria-hidden="true">·</span>
              <span>MAC: <strong className="font-mono text-slate-200">{selectedModel.macAddress}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Firmware: <strong className="font-mono text-slate-300">{selectedModel.firmwareVersion}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenGatewayRedirect}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Redirect to {selectedModel.defaultIp}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Network Topology Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Fiber-to-the-Home (FTTH) Topology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Node 1: ISP OLT */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Central ISP OLT</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Optical Line Terminal</span>
            <span className="text-[11px] font-mono text-emerald-400 mt-2">1490nm / 1310nm</span>
          </div>

          {/* Node 2: Optical Fiber Cable */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white">Single-Mode Fiber</span>
            <span className="text-[11px] text-slate-400 mt-0.5">SC/APC Drop Cable</span>
            <span className="text-[11px] font-mono text-emerald-400 mt-2">Rx: {opticalMetrics.rxPower} dBm</span>
          </div>

          {/* Node 3: ONT Terminal */}
          <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/30 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 flex items-center justify-center mb-2">
              <Server className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">{selectedModel.name}</span>
            <span className="text-[11px] text-sky-300 mt-0.5">GPON Home Gateway</span>
            <span className="text-[11px] font-mono text-sky-400 mt-2">{selectedModel.defaultIp}</span>
          </div>

          {/* Node 4: Local WiFi & LAN Clients */}
          <div
            onClick={() => onNavigateTab('devices')}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer flex flex-col items-center text-center transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
              <Laptop className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Connected Clients</span>
            <span className="text-[11px] text-slate-400 mt-0.5">{connectedDeviceCount} Active Devices</span>
            <span className="text-[11px] text-purple-400 mt-2">Manage & Scan Subnet →</span>
          </div>
        </div>
      </div>

      {/* Optical Metrics & WAN Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Optical Link Telemetry (GPON SFP) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Optical Power & Fiber Telemetry</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GPON Class B+
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Rx Power */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400">Rx Optical Power (Downlink)</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className={`text-xl font-bold font-mono ${isRxGood ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {opticalMetrics.rxPower}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">dBm</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Standard: -8 to -28 dBm</span>
                  <span className={isRxGood ? 'text-emerald-400' : 'text-amber-400'}>
                    {isRxGood ? 'Optimal' : 'Marginal'}
                  </span>
                </div>
              </div>

              {/* Tx Power */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400">Tx Optical Power (Uplink)</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className={`text-xl font-bold font-mono ${isTxGood ? 'text-emerald-400' : 'text-amber-400'}`}>
                    +{opticalMetrics.txPower}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">dBm</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Standard: +0.5 to +5.0 dBm</span>
                  <span className="text-emerald-400">Good</span>
                </div>
              </div>
            </div>

            {/* Diagnostic gauges */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Module Temp</span>
                </div>
                <div className="font-mono text-sm font-semibold text-slate-200">
                  {opticalMetrics.temperature} °C
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                  <span>Supply Voltage</span>
                </div>
                <div className="font-mono text-sm font-semibold text-slate-200">
                  {opticalMetrics.voltage} V
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Laser Bias</span>
                </div>
                <div className="font-mono text-sm font-semibold text-slate-200">
                  {opticalMetrics.biasCurrent} mA
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Registration State: <strong className="text-emerald-400 font-mono">{opticalMetrics.ponState} (Authorized)</strong></span>
            <span>Laser Output: <strong className="text-emerald-400">Normal Active</strong></span>
          </div>
        </div>

        {/* WAN / Internet Connection Status */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">WAN & Internet Connection</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {wanStatus.connectionType}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Internet IPv4 Address</span>
                <span className="font-mono font-semibold text-sky-300">{wanStatus.ipv4Address}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Default ISP Gateway</span>
                <span className="font-mono text-slate-300">{wanStatus.defaultGateway}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">DNS Servers</span>
                <span className="font-mono text-slate-300">{wanStatus.primaryDns}, {wanStatus.secondaryDns}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">IPv6 Address</span>
                <span className="font-mono text-slate-300 truncate max-w-[220px]" title={wanStatus.ipv6Address}>
                  {wanStatus.ipv6Address}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Uptime: <strong className="text-slate-200 font-mono">{formatUptime(wanStatus.uptimeSeconds)}</strong></span>
            <span>VLAN Tag: <strong className="text-slate-200 font-mono">ID {wanStatus.vlanId}</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
};
