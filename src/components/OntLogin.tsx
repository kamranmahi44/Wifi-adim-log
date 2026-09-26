import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Server,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Radio
} from 'lucide-react';
import { OntModelInfo } from '../types/ont';
import { ONT_PRESETS, DEFAULT_CREDENTIALS_CHEAT_SHEET } from '../data/defaultData';

interface OntLoginProps {
  selectedModel: OntModelInfo;
  onSelectModel: (model: OntModelInfo) => void;
  onLoginSuccess: (userRole: 'admin' | 'telecomadmin' | 'user') => void;
  onOpenGatewayRedirect: () => void;
}

export const OntLogin: React.FC<OntLoginProps> = ({
  selectedModel,
  onSelectModel,
  onLoginSuccess,
  onOpenGatewayRedirect
}) => {
  const [username, setUsername] = useState(selectedModel.defaultUser);
  const [password, setPassword] = useState(selectedModel.defaultPass);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNum1, setCaptchaNum1] = useState(7);
  const [captchaNum2, setCaptchaNum2] = useState(4);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const refreshCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 8) + 2);
    setCaptchaNum2(Math.floor(Math.random() * 8) + 1);
    setCaptchaAnswer('');
  };

  const handleModelChange = (modelId: string) => {
    const found = ONT_PRESETS.find((m) => m.id === modelId);
    if (found) {
      onSelectModel(found);
      setUsername(found.defaultUser);
      setPassword(found.defaultPass);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check captcha
    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer.trim(), 10) !== expected) {
      setErrorMessage('Security verification code is incorrect. Please try again.');
      refreshCaptcha();
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Valid credentials check: accept any reasonable admin credentials or matching defaults
      const trimmedUser = username.trim().toLowerCase();
      if (
        trimmedUser === 'telecomadmin' ||
        trimmedUser === 'admin' ||
        trimmedUser === 'root' ||
        trimmedUser === 'epadmin' ||
        trimmedUser === 'user' ||
        trimmedUser === selectedModel.defaultUser.toLowerCase()
      ) {
        const role = trimmedUser === 'telecomadmin' ? 'telecomadmin' : 'admin';
        onLoginSuccess(role);
      } else {
        setErrorMessage(
          `Invalid credentials for ${selectedModel.name}. Try default: '${selectedModel.defaultUser}' / '${selectedModel.defaultPass}' or click quick autofill.`
        );
      }
    }, 600);
  };

  const handleQuickAutofill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setCaptchaAnswer((captchaNum1 + captchaNum2).toString());
    setErrorMessage('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: ONT Hardware & System Info */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Optical Link Synchronized (O5)
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              {selectedModel.name}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {selectedModel.hardwareModel}
            </p>

            {/* Hardware Model Switcher */}
            <div className="mt-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Simulate ONT Gateway Model
              </label>
              <div className="grid grid-cols-1 gap-2">
                {ONT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleModelChange(preset.id)}
                    className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-all text-left ${
                      selectedModel.id === preset.id
                        ? 'bg-sky-500/10 border-sky-500/40 text-sky-300 font-medium'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{preset.name}</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {preset.defaultIp}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Metrics Summary */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Gateway IP Address</span>
                <span className="font-mono text-slate-200 font-medium">{selectedModel.defaultIp}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">ONT MAC Address</span>
                <span className="font-mono text-slate-200">{selectedModel.macAddress}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Optical Interface</span>
                <span className="font-mono text-emerald-400">{selectedModel.opticalType} SC/APC</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Firmware Build</span>
                <span className="font-mono text-slate-300 truncate max-w-[160px]" title={selectedModel.firmwareVersion}>
                  {selectedModel.firmwareVersion}
                </span>
              </div>
            </div>
          </div>

          {/* Direct Physical IP redirect notice */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <button
              onClick={onOpenGatewayRedirect}
              type="button"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5" />
                <span>Redirect to physical {selectedModel.defaultIp}</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right column: Admin Login Form */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Administrator Login</h2>
                  <p className="text-xs text-slate-400">Optical Network Terminal Control Console</p>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Globe className="w-3.5 h-3.5" />
                <select
                  aria-label="Interface Language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                >
                  <option>English</option>
                  <option>Español</option>
                  <option>Português</option>
                  <option>中文</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Account / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="e.g. telecomadmin / admin"
                    className="w-full pl-10 pr-20 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuickAutofill(selectedModel.defaultUser, selectedModel.defaultPass)}
                    className="absolute inset-y-1 right-1 px-2.5 text-[11px] font-medium text-sky-400 hover:text-sky-300 bg-sky-950/60 rounded border border-sky-800/50 hover:bg-sky-900/60 transition-colors"
                  >
                    Default
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-500">Case-sensitive</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security CAPTCHA */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Security Verification
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono font-bold text-sky-400 select-none">
                    <span>{captchaNum1} + {captchaNum2} = ?</span>
                    <button
                      type="button"
                      aria-label="Refresh security verification"
                      onClick={refreshCaptcha}
                      className="text-slate-500 hover:text-slate-300 transition-colors ml-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    required
                    placeholder="Result"
                    className="w-28 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono text-center"
                  />
                  <button
                    type="button"
                    onClick={() => setCaptchaAnswer((captchaNum1 + captchaNum2).toString())}
                    className="text-[11px] text-slate-400 hover:text-sky-400 underline underline-offset-2"
                  >
                    Auto-solve
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating ONT Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>Login to ONT Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onLoginSuccess('telecomadmin')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>One-Click Superadmin Demo Access</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Accordion: Default Credentials Cheat Sheet */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>Common Default ONT Passwords by ISP & Brand</span>
              </span>
              {showCheatSheet ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showCheatSheet && (
              <div className="mt-3 max-h-52 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2 space-y-1.5 text-xs font-mono">
                {DEFAULT_CREDENTIALS_CHEAT_SHEET.map((cred, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 gap-1"
                  >
                    <div>
                      <span className="font-sans font-semibold text-slate-200">{cred.brand}</span>
                      <span className="text-[11px] text-slate-500 font-sans ml-2">({cred.ip})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sky-300">{cred.user}</span>
                      <span className="text-slate-600">/</span>
                      <span className="text-amber-300">{cred.pass}</span>
                      <button
                        type="button"
                        onClick={() => handleQuickAutofill(cred.user, cred.pass.split(' / ')[0])}
                        className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-sans ml-1"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
