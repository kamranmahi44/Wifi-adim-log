export type OntBrand = 'huawei' | 'zte' | 'nokia' | 'tplink' | 'generic';

export interface OntModelInfo {
  id: OntBrand;
  name: string;
  hardwareModel: string;
  firmwareVersion: string;
  defaultIp: string;
  defaultUser: string;
  defaultPass: string;
  logoText: string;
  opticalType: 'GPON' | 'EPON' | 'XG-PON';
  macAddress: string;
  serialNumber: string;
}

export interface OpticalMetrics {
  rxPower: number; // dBm e.g. -19.45
  txPower: number; // dBm e.g. 2.35
  temperature: number; // °C e.g. 43.2
  voltage: number; // Volts e.g. 3.28
  biasCurrent: number; // mA e.g. 14.8
  ponState: 'O1' | 'O2' | 'O3' | 'O4' | 'O5'; // O5 = Operational
  rxThresholdMin: number; // -28 dBm
  rxThresholdMax: number; // -8 dBm
  txThresholdMin: number; // 0.5 dBm
  txThresholdMax: number; // 5.0 dBm
}

export interface WanStatus {
  connectionType: 'PPPoE' | 'DHCP (IPoE)' | 'Static IP';
  status: 'Connected' | 'Connecting' | 'Disconnected';
  ipv4Address: string;
  subnetMask: string;
  defaultGateway: string;
  primaryDns: string;
  secondaryDns: string;
  ipv6Address: string;
  ipv6Prefix: string;
  uptimeSeconds: number;
  vlanId: number;
}

export interface ConnectedDevice {
  id: string;
  hostname: string;
  ipAddress: string;
  macAddress: string;
  interfaceType: 'wifi-2.4' | 'wifi-5' | 'lan-1' | 'lan-2' | 'lan-3' | 'lan-4';
  rssi?: number; // dBm e.g. -54
  brand: string;
  deviceType: 'phone' | 'laptop' | 'tv' | 'gaming' | 'iot' | 'desktop';
  downloadSpeedKbps: number;
  uploadSpeedKbps: number;
  isBlocked: boolean;
  staticIpReserved: boolean;
  connectedSince: string;
}

export interface WifiBandConfig {
  enabled: boolean;
  ssid: string;
  broadcastSsid: boolean;
  securityMode: 'WPA2-PSK' | 'WPA3-Personal' | 'WPA/WPA2-PSK' | 'Open';
  encryption: 'AES' | 'TKIP+AES';
  password: string;
  channel: string; // 'auto' or '1'..'11' / '36'..'165'
  bandwidth: '20MHz' | '40MHz' | '80MHz' | '160MHz';
  txPowerPercent: 100 | 75 | 50 | 25;
}

export interface WifiSettings {
  band24: WifiBandConfig;
  band50: WifiBandConfig;
  guestWifi: {
    enabled: boolean;
    ssid: string;
    password: string;
    isolation: boolean;
    validHours: number;
  };
  wpsActive: boolean;
  wpsTimerSeconds: number;
}

export interface PortForwardingRule {
  id: string;
  serviceName: string;
  protocol: 'TCP' | 'UDP' | 'TCP/UDP';
  externalPort: string;
  internalIp: string;
  internalPort: string;
  enabled: boolean;
}

export interface MacFilterRule {
  id: string;
  macAddress: string;
  description: string;
  blocked: boolean;
}

export interface PingResult {
  host: string;
  sequence: number;
  bytes: number;
  ttl: number;
  timeMs: number;
  timestamp: string;
  isLoss: boolean;
}

export interface GatewayScanResult {
  ip: string;
  isReachable: boolean;
  responseTimeMs: number;
  label: string;
  httpStatus?: number;
}
