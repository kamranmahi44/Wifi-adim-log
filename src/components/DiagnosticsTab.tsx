import React, { useState } from 'react';
import {
  Activity,
  Terminal,
  Play,
  RotateCw,
  Gauge,
  ArrowDown,
  ArrowUp,
  Globe,
  Radio,
  CheckCircle,
  AlertTriangle,
  Server
} from 'lucide-react';
import { PingResult } from '../types/ont';

interface DiagnosticsTabProps {
  gatewayIp: string;
}

export const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({ gatewayIp }) => {
  const [activeTool, setActiveTool] = useState<'ping' | 'speedtest' | 'traceroute'>('ping');

  // Ping state
  const [pingTarget, setPingTarget] = useState(gatewayIp);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResults, setPingResults] = useState<PingResult[]>([]);
  const [pingStats, setPingStats] = useState<{ sent: number; received: number; min: number; avg: number; max: number } | null>(null);

  // Speedtest state
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [speedStage, setSpeedStage] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [speedData, setSpeedData] = useState({
    ping: 4,
    jitter: 1.2,
    download: 0,
    upload: 0
  });

  // Traceroute state
  const [isTracing, setIsTracing] = useState(false);
  const [traceHops, setTraceHops] = useState<
    Array<{ hop: number; ip: string; host: string; rtt1: string; rtt2: string; rtt3: string }>
  >([]);

  // Run simulated Ping
  const handleStartPing = () => {
    setIsPinging(true);
    setPingResults([]);
    setPingStats(null);

    const totalPackets = 5;
    let seq = 1;
    const results: PingResult[] = [];
    const isLocal = pingTarget === gatewayIp || pingTarget.startsWith('192.168.');

    const interval = setInterval(() => {
      const latency = isLocal
        ? (Math.random() * 1.5 + 0.8).toFixed(2)
        : (Math.random() * 12 + 14).toFixed(2);

      const item: PingResult = {
        host: pingTarget,
        sequence: seq,
        bytes: 64,
        ttl: isLocal ? 64 : 118,
        timeMs: parseFloat(latency),
        timestamp: new Date().toLocaleTimeString(),
        isLoss: false
      };

      results.push(item);
      setPingResults([...results]);
      seq++;

      if (seq > totalPackets) {
        clearInterval(interval);
        setIsPinging(false);
        const times = results.map((r) => r.timeMs);
        setPingStats({
          sent: totalPackets,
          received: totalPackets,
          min: Math.min(...times),
          avg: parseFloat((times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)),
          max: Math.max(...times)
        });
      }
    }, 500);
  };

  // Run simulated Speedtest
  const handleStartSpeedtest = () => {
    setIsTestingSpeed(true);
    setSpeedStage('ping');
    setSpeedData({ ping: 3, jitter: 0.9, download: 0, upload: 0 });

    setTimeout(() => {
      setSpeedStage('download');
      let dl = 50;
      const dlInterval = setInterval(() => {
        dl += Math.floor(Math.random() * 95) + 30;
        if (dl >= 850) {
          dl = 852.4;
          clearInterval(dlInterval);
          setSpeedStage('upload');

          let ul = 20;
          const ulInterval = setInterval(() => {
            ul += Math.floor(Math.random() * 80) + 30;
            if (ul >= 520) {
              ul = 518.7;
              clearInterval(ulInterval);
              setSpeedStage('complete');
              setIsTestingSpeed(false);
            }
            setSpeedData((prev) => ({ ...prev, upload: parseFloat(ul.toFixed(1)) }));
          }, 100);
        }
        setSpeedData((prev) => ({ ...prev, download: parseFloat(dl.toFixed(1)) }));
      }, 100);
    }, 1000);
  };

  // Run simulated Traceroute
  const handleStartTraceroute = () => {
    setIsTracing(true);
    setTraceHops([]);

    const mockHops = [
      { hop: 1, ip: gatewayIp, host: 'ont.lan', rtt1: '0.8 ms', rtt2: '0.9 ms', rtt3: '0.7 ms' },
      { hop: 2, ip: '100.74.120.1', host: 'isp-bras-node.bb.net', rtt1: '4.2 ms', rtt2: '4.1 ms', rtt3: '4.3 ms' },
      { hop: 3, ip: '172.16.88.25', host: 'core01.region.isp.net', rtt1: '8.5 ms', rtt2: '8.4 ms', rtt3: '8.7 ms' },
      { hop: 4, ip: '142.250.160.1', host: 'google-ix-peer.as15169.net', rtt1: '14.1 ms', rtt2: '13.9 ms', rtt3: '14.2 ms' },
      { hop: 5, ip: '8.8.8.8', host: 'dns.google', rtt1: '14.8 ms', rtt2: '14.5 ms', rtt3: '14.7 ms' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < mockHops.length) {
        setTraceHops((prev) => [...prev, mockHops[current]]);
        current++;
      } else {
        clearInterval(interval);
        setIsTracing(false);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Subtool switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white">Network Diagnostics & Performance Tools</h2>
          <p className="text-xs text-slate-400">Test latency, bandwidth throughput, and router packet routing</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTool('ping')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTool === 'ping' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ICMP Ping
          </button>
          <button
            onClick={() => setActiveTool('speedtest')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTool === 'speedtest' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fiber Speedtest
          </button>
          <button
            onClick={() => setActiveTool('traceroute')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTool === 'traceroute' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Traceroute
          </button>
        </div>
      </div>

      {/* Ping Utility Tool */}
      {activeTool === 'ping' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Target IP Address or Hostname
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={pingTarget}
                onChange={(e) => setPingTarget(e.target.value)}
                placeholder="192.168.1.1 or 8.8.8.8"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={handleStartPing}
                disabled={isPinging}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                {isPinging ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPinging ? 'Pinging...' : 'Start Ping Test'}</span>
              </button>
            </div>

            {/* Quick target presets */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-slate-500">Presets:</span>
              <button
                onClick={() => setPingTarget(gatewayIp)}
                className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 font-mono text-[11px]"
              >
                ONT Gateway ({gatewayIp})
              </button>
              <button
                onClick={() => setPingTarget('8.8.8.8')}
                className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 font-mono text-[11px]"
              >
                Google DNS (8.8.8.8)
              </button>
              <button
                onClick={() => setPingTarget('1.1.1.1')}
                className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 font-mono text-[11px]"
              >
                Cloudflare (1.1.1.1)
              </button>
            </div>
          </div>

          {/* Terminal Console View */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto min-h-[160px]">
            <div className="text-slate-500 mb-2">
              PING {pingTarget} (64 bytes of data):
            </div>
            <div className="space-y-1">
              {pingResults.map((r) => (
                <div key={r.sequence} className="text-slate-300 flex items-center justify-between">
                  <span>
                    64 bytes from {r.host}: icmp_seq={r.sequence} ttl={r.ttl} time={r.timeMs} ms
                  </span>
                  <span className="text-[10px] text-slate-500">{r.timestamp}</span>
                </div>
              ))}
              {pingResults.length === 0 && !isPinging && (
                <div className="text-slate-600 italic">Click Start Ping Test to measure round-trip latency.</div>
              )}
            </div>

            {pingStats && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-emerald-400 space-y-1">
                <div>--- {pingTarget} ping statistics ---</div>
                <div>
                  {pingStats.sent} packets transmitted, {pingStats.received} received, 0% packet loss
                </div>
                <div className="text-slate-300">
                  rtt min/avg/max = {pingStats.min} / {pingStats.avg} / {pingStats.max} ms
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Speedtest Tool */}
      {activeTool === 'speedtest' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">GPON Fiber Bandwidth Analyzer</h3>
              <p className="text-xs text-slate-400">Benchmarking connection to local telecom speedtest server</p>
            </div>

            <button
              onClick={handleStartSpeedtest}
              disabled={isTestingSpeed}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Gauge className="w-4 h-4" />
              <span>{isTestingSpeed ? `Testing (${speedStage})...` : 'Run Speedtest'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Ping */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-medium">Idle Ping</span>
              <div className="mt-2 font-mono text-2xl font-bold text-sky-400">
                {speedData.ping} <span className="text-xs text-slate-500">ms</span>
              </div>
              <span className="text-[11px] text-slate-500">Ultra-low fiber delay</span>
            </div>

            {/* Jitter */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-medium">Jitter</span>
              <div className="mt-2 font-mono text-2xl font-bold text-emerald-400">
                {speedData.jitter} <span className="text-xs text-slate-500">ms</span>
              </div>
              <span className="text-[11px] text-slate-500">Stability index</span>
            </div>

            {/* Download */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400 font-medium">
                <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download</span>
              </div>
              <div className="mt-2 font-mono text-2xl font-bold text-emerald-400">
                {speedData.download} <span className="text-xs text-slate-500">Mbps</span>
              </div>
              <span className="text-[11px] text-slate-500">Gigabit optical link</span>
            </div>

            {/* Upload */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400 font-medium">
                <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Upload</span>
              </div>
              <div className="mt-2 font-mono text-2xl font-bold text-indigo-400">
                {speedData.upload} <span className="text-xs text-slate-500">Mbps</span>
              </div>
              <span className="text-[11px] text-slate-500">Symmetrical capability</span>
            </div>
          </div>
        </div>
      )}

      {/* Traceroute Tool */}
      {activeTool === 'traceroute' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Visual Path Traceroute</h3>
              <p className="text-xs text-slate-400">Trace network hops from your ONT router to global DNS (8.8.8.8)</p>
            </div>

            <button
              onClick={handleStartTraceroute}
              disabled={isTracing}
              className="inline-flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isTracing ? 'animate-spin' : ''}`} />
              <span>{isTracing ? 'Tracing Route...' : 'Start Trace to 8.8.8.8'}</span>
            </button>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto min-h-[160px] space-y-2">
            <div className="text-slate-500">
              traceroute to 8.8.8.8 (dns.google), 30 hops max, 60 byte packets
            </div>

            {traceHops.map((h) => (
              <div key={h.hop} className="flex items-center justify-between py-1 border-b border-slate-900 text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-slate-500 font-bold">{h.hop}</span>
                  <span className="text-white font-medium">{h.host}</span>
                  <span className="text-sky-400">({h.ip})</span>
                </div>
                <div className="text-emerald-400 font-mono">
                  {h.rtt1} &nbsp; {h.rtt2} &nbsp; {h.rtt3}
                </div>
              </div>
            ))}

            {traceHops.length === 0 && !isTracing && (
              <div className="text-slate-600 italic py-4">Click Start Trace to visualize intermediate ISP and transit router hops.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
