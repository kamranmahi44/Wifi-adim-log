import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Smartphone, Wifi } from 'lucide-react';

interface WifiQrCodeProps {
  ssid: string;
  password?: string;
  securityMode?: string;
  hiddenSsid?: boolean;
  type?: 'wifi' | 'url';
  targetUrl?: string;
  title?: string;
}

export const WifiQrCode: React.FC<WifiQrCodeProps> = ({
  ssid,
  password = '',
  securityMode = 'WPA2-PSK',
  hiddenSsid = false,
  type = 'wifi',
  targetUrl,
  title
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Format standard Wi-Fi configuration string: WIFI:T:WPA;S:MySSID;P:mypassword;H:false;;
  const wifiString = React.useMemo(() => {
    if (type === 'url' && targetUrl) {
      return targetUrl;
    }
    const authType = securityMode === 'Open' ? 'nopass' : 'WPA';
    const escapedSsid = ssid.replace(/([\\;,:"])/g, '\\$1');
    const escapedPassword = password.replace(/([\\;,:"])/g, '\\$1');
    const hidden = hiddenSsid ? 'true' : 'false';

    return `WIFI:T:${authType};S:${escapedSsid};P:${escapedPassword};H:${hidden};;`;
  }, [ssid, password, securityMode, hiddenSsid, type, targetUrl]);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(wifiString, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });

    return () => {
      isMounted = false;
    };
  }, [wifiString]);

  const handleCopyRaw = async () => {
    try {
      await navigator.clipboard.writeText(wifiString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadImage = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${type === 'wifi' ? `wifi_${ssid}` : 'ont_admin_url'}_qr.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center p-5 bg-slate-900 border border-slate-800 rounded-xl">
      <div className="flex items-center gap-2 mb-3 text-slate-200">
        {type === 'wifi' ? (
          <Wifi className="w-4 h-4 text-emerald-400" />
        ) : (
          <QrCode className="w-4 h-4 text-sky-400" />
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {title || (type === 'wifi' ? 'Scan to Connect WiFi' : 'Scan to Open on Mobile')}
        </span>
      </div>

      <div className="relative p-3 bg-white rounded-lg shadow-lg border border-slate-200">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={type === 'wifi' ? `WiFi Connect QR for ${ssid}` : 'Admin URL QR'}
            className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
          />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
            Generating QR...
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs font-medium text-slate-200">{type === 'wifi' ? ssid : targetUrl}</p>
        <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-slate-400">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Point iOS or Android camera to {type === 'wifi' ? 'join network' : 'open URL'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 w-full">
        <button
          onClick={handleDownloadImage}
          disabled={!qrDataUrl}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save QR</span>
        </button>
        <button
          onClick={handleCopyRaw}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : type === 'wifi' ? 'Copy WiFi Code' : 'Copy URL'}</span>
        </button>
      </div>
    </div>
  );
};
