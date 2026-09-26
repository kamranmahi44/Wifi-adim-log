import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Tv,
  Gamepad2,
  Cpu,
  Monitor,
  Wifi,
  Network,
  Search,
  ShieldBan,
  ShieldCheck,
  Edit2,
  Check,
  X,
  RefreshCw,
  Plus,
  ArrowDown,
  ArrowUp,
  Radio,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';
import { ConnectedDevice } from '../types/ont';

interface DevicesTabProps {
  devices: ConnectedDevice[];
  onUpdateDevice: (updated: ConnectedDevice) => void;
  onAddDevice: (device: ConnectedDevice) => void;
  gatewayIp: string;
}

export const DevicesTab: React.FC<DevicesTabProps> = ({
  devices,
  onUpdateDevice,
  onAddDevice,
  gatewayIp
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'wifi' | 'lan' | 'blocked'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // Subnet Scanner state
  const [isScanningSubnet, setIsScanningSubnet] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCurrentIp, setScanCurrentIp] = useState('');
  const [discoveredSubnetNodes, setDiscoveredSubnetNodes] = useState<
    Array<{ ip: string; mac: string; vendor: string; port: string; added: boolean }>
  >([]);

  const getDeviceIcon = (type: ConnectedDevice['deviceType']) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="w-4 h-4 text-sky-400" />;
      case 'laptop':
        return <Laptop className="w-4 h-4 text-indigo-400" />;
      case 'tv':
        return <Tv className="w-4 h-4 text-emerald-400" />;
      case 'gaming':
        return <Gamepad2 className="w-4 h-4 text-amber-400" />;
      case 'iot':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      default:
        return <Monitor className="w-4 h-4 text-slate-400" />;
    }
  };

  const getInterfaceBadge = (dev: ConnectedDevice) => {
    if (dev.interfaceType.startsWith('wifi')) {
      const is5G = dev.interfaceType === 'wifi-5';
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono ${
          is5G ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          <Wifi className="w-3 h-3" />
          <span>{is5G ? '5 GHz' : '2.4 GHz'}</span>
          {dev.rssi && <span className="text-[10px] text-slate-500">({dev.rssi} dBm)</span>}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
        <Network className="w-3 h-3" />
        <span className="uppercase">{dev.interfaceType.replace('-', ' ')} (1 Gbps)</span>
      </span>
    );
  };

  const filteredDevices = devices.filter((dev) => {
    const matchesSearch =
      dev.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.ipAddress.includes(searchTerm) ||
      dev.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.brand.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'wifi') return dev.interfaceType.startsWith('wifi');
    if (filterType === 'lan') return dev.interfaceType.startsWith('lan');
    if (filterType === 'blocked') return dev.isBlocked;
    return true;
  });

  const handleStartRename = (dev: ConnectedDevice) => {
    setEditingId(dev.id);
    setEditName(dev.hostname);
  };

  const handleSaveRename = (dev: ConnectedDevice) => {
    if (editName.trim()) {
      onUpdateDevice({ ...dev, hostname: editName.trim() });
    }
    setEditingId(null);
  };

  const handleToggleBlock = (dev: ConnectedDevice) => {
    onUpdateDevice({ ...dev, isBlocked: !dev.isBlocked });
  };

  const handleToggleStaticIp = (dev: ConnectedDevice) => {
    onUpdateDevice({ ...dev, staticIpReserved: !dev.staticIpReserved });
  };

  // Run simulated subnet IP scanner
  const handleRunSubnetScan = () => {
    setIsScanningSubnet(true);
    setScanProgress(0);
    setDiscoveredSubnetNodes([]);

    const basePrefix = gatewayIp.substring(0, gatewayIp.lastIndexOf('.')) || '192.168.1';
    let currentIdx = 1;

    const mockCandidates = [
      { ip: `${basePrefix}.101`, mac: 'DC:A6:32:48:82:11', vendor: 'Raspberry Pi Foundation', port: '80, 22' },
      { ip: `${basePrefix}.112`, mac: '40:9B:CD:88:51:7A', vendor: 'Amazon Echo Show', port: '443, 8008' },
      { ip: `${basePrefix}.135`, mac: '00:11:32:9B:41:22', vendor: 'Synology NAS DiskStation', port: '5000, 5001, 80' },
      { ip: `${basePrefix}.150`, mac: 'AC:84:C6:18:90:FD', vendor: 'Google Nest Cam', port: '443' }
    ];

    const discovered: typeof mockCandidates = [];

    const interval = setInterval(() => {
      currentIdx += 8;
      const target = `${basePrefix}.${Math.min(currentIdx, 254)}`;
      setScanCurrentIp(target);
      const pct = Math.min(Math.round((currentIdx / 254) * 100), 100);
      setScanProgress(pct);

      mockCandidates.forEach((c) => {
        const lastOctet = parseInt(c.ip.split('.')[3], 10);
        if (currentIdx >= lastOctet && !discovered.some((d) => d.ip === c.ip)) {
          discovered.push(c);
          setDiscoveredSubnetNodes([...discovered.map((item) => ({ ...item, added: false }))]);
        }
      });

      if (currentIdx >= 254) {
        clearInterval(interval);
        setIsScanningSubnet(false);
        setScanProgress(100);
      }
    }, 120);
  };

  const handleAddDiscoveredToManaged = (item: { ip: string; mac: string; vendor: string }) => {
    const newDevice: ConnectedDevice = {
      id: `dev-${Date.now()}`,
      hostname: item.vendor.replace(/\s+/g, '-'),
      ipAddress: item.ip,
      macAddress: item.mac,
      interfaceType: 'wifi-2.4',
      rssi: -58,
      brand: item.vendor.split(' ')[0],
      deviceType: item.vendor.includes('NAS') ? 'desktop' : 'iot',
      downloadSpeedKbps: 450,
      uploadSpeedKbps: 120,
      isBlocked: false,
      staticIpReserved: false,
      connectedSince: 'Just now'
    };
    onAddDevice(newDevice);
    setDiscoveredSubnetNodes((prev) =>
      prev.map((n) => (n.ip === item.ip ? { ...n, added: true } : n))
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls: Search, Filter Tabs, and Subnet Scan CTA */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hostname, IP, MAC, brand..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterType === 'all' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({devices.length})
            </button>
            <button
              onClick={() => setFilterType('wifi')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterType === 'wifi' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              WiFi
            </button>
            <button
              onClick={() => setFilterType('lan')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterType === 'lan' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ethernet LAN
            </button>
            <button
              onClick={() => setFilterType('blocked')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterType === 'blocked' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Blocked
            </button>
          </div>
        </div>

        {/* Scan Subnet Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSubnetScan}
            disabled={isScanningSubnet}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningSubnet ? 'animate-spin' : ''}`} />
            <span>{isScanningSubnet ? 'Scanning Subnet...' : 'Scan Local Subnet (/24)'}</span>
          </button>
        </div>
      </div>

      {/* Subnet Scanner Progress & Results Panel (when active or discovered) */}
      {(isScanningSubnet || discoveredSubnetNodes.length > 0) && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Subnet Discovery Scanner: {gatewayIp.substring(0, gatewayIp.lastIndexOf('.'))}.0/24
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {isScanningSubnet ? `Testing ${scanCurrentIp} (${scanProgress}%)` : `Found ${discoveredSubnetNodes.length} devices`}
            </span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full transition-all duration-200"
              style={{ width: `${scanProgress}%` }}
            />
          </div>

          {discoveredSubnetNodes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {discoveredSubnetNodes.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-emerald-400">{item.ip}</div>
                    <div className="text-xs font-medium text-slate-200 mt-0.5">{item.vendor}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">MAC: {item.mac}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Open Ports: {item.port}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-900 flex justify-end">
                    {item.added ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <Check className="w-3 h-3" />
                        <span>Added to Table</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddDiscoveredToManaged(item)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-sky-950 hover:bg-sky-900 text-sky-300 text-[11px] font-medium rounded border border-sky-800 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Manage Device</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connected Devices Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Active Connected Devices</h3>
            <p className="text-xs text-slate-400">Manage client bandwidth, DHCP static IP, and access permissions</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {filteredDevices.length} Connected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Device / Hostname</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">MAC Address</th>
                <th className="py-3 px-4">Interface / Band</th>
                <th className="py-3 px-4 text-right">Throughput</th>
                <th className="py-3 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredDevices.map((dev) => {
                const isEditing = editingId === dev.id;

                return (
                  <tr
                    key={dev.id}
                    className={`hover:bg-slate-850/50 transition-colors ${
                      dev.isBlocked ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    {/* Device & Hostname */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                          {getDeviceIcon(dev.deviceType)}
                        </div>

                        <div>
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-2 py-1 bg-slate-950 border border-sky-500 rounded text-xs text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveRename(dev)}
                                className="p-1 text-emerald-400 hover:text-emerald-300"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 text-slate-400 hover:text-slate-200"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-white">{dev.hostname}</span>
                              <button
                                onClick={() => handleStartRename(dev)}
                                className="p-0.5 text-slate-500 hover:text-slate-300 transition-colors"
                                title="Rename device"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {dev.brand} · Online {dev.connectedSince}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* IP Address */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-200 font-medium">{dev.ipAddress}</div>
                      {dev.staticIpReserved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 font-mono">
                          <BookmarkCheck className="w-3 h-3" />
                          <span>Static Reserved</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">DHCP Lease</span>
                      )}
                    </td>

                    {/* MAC Address */}
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {dev.macAddress}
                    </td>

                    {/* Interface & Signal */}
                    <td className="py-3.5 px-4">
                      {getInterfaceBadge(dev)}
                    </td>

                    {/* Current Bandwidth */}
                    <td className="py-3.5 px-4 text-right">
                      {dev.isBlocked ? (
                        <span className="text-[11px] text-rose-400 font-medium">Blocked</span>
                      ) : (
                        <div className="font-mono text-[11px] space-y-0.5">
                          <div className="flex items-center justify-end gap-1 text-emerald-400">
                            <ArrowDown className="w-3 h-3" />
                            <span>{(dev.downloadSpeedKbps / 1000).toFixed(1)} Mbps</span>
                          </div>
                          <div className="flex items-center justify-end gap-1 text-slate-400">
                            <ArrowUp className="w-3 h-3" />
                            <span>{(dev.uploadSpeedKbps / 1000).toFixed(1)} Mbps</span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Action Controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Static IP Toggle */}
                        <button
                          onClick={() => handleToggleStaticIp(dev)}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
                            dev.staticIpReserved
                              ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                          title={dev.staticIpReserved ? 'Release Static IP' : 'Reserve Static IP'}
                        >
                          {dev.staticIpReserved ? 'Reserved' : 'Set Static'}
                        </button>

                        {/* Block/Unblock Button */}
                        <button
                          onClick={() => handleToggleBlock(dev)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                            dev.isBlocked
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800'
                          }`}
                        >
                          {dev.isBlocked ? (
                            <>
                              <ShieldBan className="w-3 h-3 text-rose-400" />
                              <span>Unblock</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>Block</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredDevices.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              No devices match the current filter or search criteria.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
