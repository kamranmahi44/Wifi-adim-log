import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Server,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  Plus,
  Trash2,
  Check,
  Power
} from 'lucide-react';
import { PortForwardingRule, OntModelInfo } from '../types/ont';
import { DEFAULT_PORT_FORWARDING_RULES } from '../data/defaultData';

interface SystemSecurityTabProps {
  selectedModel: OntModelInfo;
  onReboot: () => void;
}

export const SystemSecurityTab: React.FC<SystemSecurityTabProps> = ({
  selectedModel,
  onReboot
}) => {
  const [rules, setRules] = useState<PortForwardingRule[]>(DEFAULT_PORT_FORWARDING_RULES);
  const [firewallLevel, setFirewallLevel] = useState<'Standard' | 'High' | 'Low'>('Standard');
  const [dosProtection, setDosProtection] = useState(true);
  const [remoteWanAccess, setRemoteWanAccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState<Partial<PortForwardingRule>>({
    serviceName: '',
    protocol: 'TCP',
    externalPort: '',
    internalIp: '192.168.1.100',
    internalPort: '',
    enabled: true
  });
  const [showRebootConfirm, setShowRebootConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.serviceName || !newRule.externalPort || !newRule.internalPort) return;

    const created: PortForwardingRule = {
      id: `pf-${Date.now()}`,
      serviceName: newRule.serviceName,
      protocol: newRule.protocol as any,
      externalPort: newRule.externalPort,
      internalIp: newRule.internalIp || '192.168.1.100',
      internalPort: newRule.internalPort,
      enabled: true
    };

    setRules([...rules, created]);
    setShowAddModal(false);
    setNewRule({
      serviceName: '',
      protocol: 'TCP',
      externalPort: '',
      internalIp: '192.168.1.100',
      internalPort: '',
      enabled: true
    });
  };

  const handleDownloadBackup = () => {
    setIsBackingUp(true);
    const backupData = {
      model: selectedModel.name,
      hardware: selectedModel.hardwareModel,
      firmware: selectedModel.firmwareVersion,
      mac: selectedModel.macAddress,
      timestamp: new Date().toISOString(),
      firewallLevel,
      dosProtection,
      rules
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ont_config_backup_${selectedModel.id}_${Date.now()}.cfg`;
    a.click();
    setTimeout(() => setIsBackingUp(false), 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Firewall & Security Settings */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">SPI Firewall & Threat Mitigation</h3>
              <p className="text-xs text-slate-400">Stateful packet inspection and brute-force defenses</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active Protection
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Firewall Security Level
            </label>
            <select
              aria-label="Firewall Security Level"
              value={firewallLevel}
              onChange={(e) => setFirewallLevel(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="Standard">Standard (Blocks unrequested WAN packets)</option>
              <option value="High">High (Strict ICMP stealth & port drops)</option>
              <option value="Low">Low (Permissive NAT)</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">DoS Defense</span>
              <span className="text-[11px] text-slate-400">SYN / UDP / ICMP flood filter</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dosProtection}
                onChange={(e) => setDosProtection(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">WAN Web Access</span>
              <span className="text-[11px] text-slate-400">Access admin portal from public IP</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remoteWanAccess}
                onChange={(e) => setRemoteWanAccess(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600" />
            </label>
          </div>
        </div>
      </div>

      {/* Port Forwarding / Virtual Server */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Port Forwarding / Virtual Server</h3>
            <p className="text-xs text-slate-400">Direct inbound internet traffic to internal devices and services</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">External Port</th>
                <th className="py-3 px-4">Internal Host IP</th>
                <th className="py-3 px-4">Internal Port</th>
                <th className="py-3 px-4 text-right">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-850/50">
                  <td className="py-3.5 px-4 font-semibold text-white">{rule.serviceName}</td>
                  <td className="py-3.5 px-4 font-mono text-sky-400">{rule.protocol}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">{rule.externalPort}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{rule.internalIp}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">{rule.internalPort}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
                          rule.enabled
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ONT Device Operations: Reboot & Backup */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">System Maintenance & Device Power</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Reboot Button */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Reboot ONT Terminal</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Soft-restart wireless radios and optical link safely.
              </p>
            </div>
            <button
              onClick={() => setShowRebootConfirm(true)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              <span>Reboot Device</span>
            </button>
          </div>

          {/* Backup Config */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Backup Configuration</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Export current WiFi SSIDs, passwords, and NAT rules as a backup file.
              </p>
            </div>
            <button
              onClick={handleDownloadBackup}
              disabled={isBackingUp}
              className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBackingUp ? 'Exporting...' : 'Export .cfg File'}</span>
            </button>
          </div>

          {/* Factory Reset */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-300 block">Factory Reset</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Restore default IP ({selectedModel.defaultIp}) and factory credentials.
              </p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium rounded-lg border border-rose-500/20 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Factory Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* Add Port Forwarding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Add Port Forwarding Rule</h3>
            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Service / Application Name</label>
                <input
                  type="text"
                  required
                  value={newRule.serviceName}
                  onChange={(e) => setNewRule({ ...newRule, serviceName: e.target.value })}
                  placeholder="e.g. Web Server"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Protocol</label>
                  <select
                    aria-label="Port Forwarding Protocol"
                    value={newRule.protocol}
                    onChange={(e) => setNewRule({ ...newRule, protocol: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="TCP/UDP">TCP/UDP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">External Port</label>
                  <input
                    type="text"
                    required
                    value={newRule.externalPort}
                    onChange={(e) => setNewRule({ ...newRule, externalPort: e.target.value })}
                    placeholder="8080"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Internal Host IP</label>
                  <input
                    type="text"
                    required
                    value={newRule.internalIp}
                    onChange={(e) => setNewRule({ ...newRule, internalIp: e.target.value })}
                    placeholder="192.168.1.100"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Internal Port</label>
                  <input
                    type="text"
                    required
                    value={newRule.internalPort}
                    onChange={(e) => setNewRule({ ...newRule, internalPort: e.target.value })}
                    placeholder="80"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reboot Confirm Modal */}
      {showRebootConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white">Reboot ONT Gateway?</h3>
            <p className="text-xs text-slate-400">
              All active Wi-Fi and wired connections will temporarily disconnect for ~25 seconds while the router power-cycles.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowRebootConfirm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRebootConfirm(false);
                  onReboot();
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg"
              >
                Confirm Reboot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Factory Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Confirm Factory Reset</h3>
            <p className="text-xs text-slate-400">
              This will erase all custom SSIDs, passwords, port mappings, and revert the ONT to factory settings (<span className="font-mono text-slate-300">{selectedModel.defaultIp}</span>).
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onReboot();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg"
              >
                Erase & Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
