import { OntModelInfo, OpticalMetrics, WanStatus, ConnectedDevice, WifiSettings, PortForwardingRule } from '../types/ont';

export const ONT_PRESETS: OntModelInfo[] = [
  {
    id: 'huawei',
    name: 'Huawei EchoLife',
    hardwareModel: 'HG8245W5-6T Dual-Band GPON Terminal',
    firmwareVersion: 'V500R019C20SPC150',
    defaultIp: '192.168.100.1',
    defaultUser: 'telecomadmin',
    defaultPass: 'admintelecom',
    logoText: 'HUAWEI EchoLife GPON',
    opticalType: 'GPON',
    macAddress: 'E4:68:A3:8C:F1:20',
    serialNumber: '48575443F8B312A9'
  },
  {
    id: 'zte',
    name: 'ZTE NetBox',
    hardwareModel: 'ZXHN F670L AC1200 GPON ONT',
    firmwareVersion: 'V9.0.10P1T2',
    defaultIp: '192.168.1.1',
    defaultUser: 'admin',
    defaultPass: 'admin',
    logoText: 'ZTE Broadband Gateway',
    opticalType: 'GPON',
    macAddress: 'D8:74:95:4A:21:BC',
    serialNumber: 'ZTEGC2889A14'
  },
  {
    id: 'nokia',
    name: 'Nokia Optical Terminal',
    hardwareModel: 'G-240W-A Gigabit WiFi Gateway',
    firmwareVersion: '3FE46872AFCA18',
    defaultIp: '192.168.1.254',
    defaultUser: 'admin',
    defaultPass: 'Nokia@123',
    logoText: 'NOKIA Optical Gateway',
    opticalType: 'GPON',
    macAddress: 'A0:36:BC:54:19:80',
    serialNumber: 'ALCLB9284710'
  },
  {
    id: 'tplink',
    name: 'TP-Link Archer Fiber',
    hardwareModel: 'XC220-G3v AC1200 Wireless VoIP GPON',
    firmwareVersion: '1.2.0 Build 20240816',
    defaultIp: '192.168.1.1',
    defaultUser: 'admin',
    defaultPass: 'admin',
    logoText: 'TP-Link Archer GPON',
    opticalType: 'GPON',
    macAddress: '74:83:C2:59:71:0D',
    serialNumber: 'TPLK91823746'
  },
  {
    id: 'generic',
    name: 'Standard GPON Gateway',
    hardwareModel: 'GPON/EPON Gigabit FTTH Gateway',
    firmwareVersion: 'Build 4.12.8-rel',
    defaultIp: '192.168.1.1',
    defaultUser: 'admin',
    defaultPass: 'password',
    logoText: 'Fiber Optical Terminal',
    opticalType: 'GPON',
    macAddress: '00:1E:58:3B:49:AE',
    serialNumber: 'GPON202609001'
  }
];

export const DEFAULT_CREDENTIALS_CHEAT_SHEET = [
  { brand: 'Huawei', ip: '192.168.100.1 / 192.168.18.1', user: 'telecomadmin', pass: 'admintelecom', note: 'Full superadmin access on Huawei GPON' },
  { brand: 'Huawei (Standard)', ip: '192.168.1.1', user: 'root', pass: 'admin', note: 'Standard root login' },
  { brand: 'ZTE', ip: '192.168.1.1', user: 'admin', pass: 'admin', note: 'Standard factory default' },
  { brand: 'ZTE Superadmin', ip: '192.168.1.1', user: 'admin', pass: 'smartadmin', note: 'Telecom operator installer mode' },
  { brand: 'Nokia / Alcatel', ip: '192.168.1.254', user: 'admin', pass: 'admin / Nokia@123', note: 'Standard GPON gateway address' },
  { brand: 'TP-Link Fiber', ip: '192.168.1.1', user: 'admin', pass: 'admin', note: 'Or printed on the bottom label sticker' },
  { brand: 'D-Link / Digisol', ip: '192.168.1.1', user: 'admin', pass: 'admin123', note: 'Common default' },
  { brand: 'BSNL / Syrotech', ip: '192.168.1.1', user: 'Epadmin', pass: 'adminEp', note: 'Common Indian fiber ONT login' },
  { brand: 'Airtel Xstream', ip: '192.168.1.1', user: 'admin', pass: 'airtel@123 / admin', note: 'Airtel Fiber GPON default' },
  { brand: 'JioFiber Gateway', ip: '192.168.29.1', user: 'admin', pass: 'Jiocentrum', note: 'Jio Home Gateway portal' }
];

export const DEFAULT_OPTICAL_METRICS: OpticalMetrics = {
  rxPower: -19.45,
  txPower: 2.38,
  temperature: 42.6,
  voltage: 3.29,
  biasCurrent: 14.7,
  ponState: 'O5',
  rxThresholdMin: -28.0,
  rxThresholdMax: -8.0,
  txThresholdMin: 0.5,
  txThresholdMax: 5.0
};

export const DEFAULT_WAN_STATUS: WanStatus = {
  connectionType: 'PPPoE',
  status: 'Connected',
  ipv4Address: '103.112.54.89',
  subnetMask: '255.255.255.0',
  defaultGateway: '103.112.54.1',
  primaryDns: '8.8.8.8',
  secondaryDns: '1.1.1.1',
  ipv6Address: '2405:201:8002:4981::1a4',
  ipv6Prefix: '/64',
  uptimeSeconds: 384920,
  vlanId: 100
};

export const DEFAULT_DEVICES: ConnectedDevice[] = [
  {
    id: 'dev-1',
    hostname: 'iPhone-15-Pro',
    ipAddress: '192.168.1.102',
    macAddress: '3C:06:30:4A:28:19',
    interfaceType: 'wifi-5',
    rssi: -52,
    brand: 'Apple',
    deviceType: 'phone',
    downloadSpeedKbps: 4200,
    uploadSpeedKbps: 340,
    isBlocked: false,
    staticIpReserved: false,
    connectedSince: '4h 12m'
  },
  {
    id: 'dev-2',
    hostname: 'MacBook-Pro-M2',
    ipAddress: '192.168.1.105',
    macAddress: 'F0:18:98:C1:2B:64',
    interfaceType: 'wifi-5',
    rssi: -46,
    brand: 'Apple',
    deviceType: 'laptop',
    downloadSpeedKbps: 18500,
    uploadSpeedKbps: 1200,
    isBlocked: false,
    staticIpReserved: true,
    connectedSince: '1d 6h'
  },
  {
    id: 'dev-3',
    hostname: 'Samsung-Galaxy-S24',
    ipAddress: '192.168.1.108',
    macAddress: '88:79:7E:91:02:FA',
    interfaceType: 'wifi-5',
    rssi: -61,
    brand: 'Samsung',
    deviceType: 'phone',
    downloadSpeedKbps: 840,
    uploadSpeedKbps: 95,
    isBlocked: false,
    staticIpReserved: false,
    connectedSince: '2h 45m'
  },
  {
    id: 'dev-4',
    hostname: 'LG-OLED-4K-TV',
    ipAddress: '192.168.1.115',
    macAddress: '00:E0:4C:68:04:78',
    interfaceType: 'lan-1',
    brand: 'LG Electronics',
    deviceType: 'tv',
    downloadSpeedKbps: 24500,
    uploadSpeedKbps: 410,
    isBlocked: false,
    staticIpReserved: true,
    connectedSince: '3d 11h'
  },
  {
    id: 'dev-5',
    hostname: 'Sony-PlayStation-5',
    ipAddress: '192.168.1.120',
    macAddress: '70:9E:29:10:4E:93',
    interfaceType: 'lan-2',
    brand: 'Sony Interactive',
    deviceType: 'gaming',
    downloadSpeedKbps: 1200,
    uploadSpeedKbps: 310,
    isBlocked: false,
    staticIpReserved: true,
    connectedSince: '5h 18m'
  },
  {
    id: 'dev-6',
    hostname: 'ESP32-Smart-Bulb-Hub',
    ipAddress: '192.168.1.145',
    macAddress: '24:6F:28:90:3A:D1',
    interfaceType: 'wifi-2.4',
    rssi: -72,
    brand: 'Espressif IoT',
    deviceType: 'iot',
    downloadSpeedKbps: 12,
    uploadSpeedKbps: 8,
    isBlocked: false,
    staticIpReserved: false,
    connectedSince: '4d 2h'
  },
  {
    id: 'dev-7',
    hostname: 'Amazon-Echo-Dot',
    ipAddress: '192.168.1.160',
    macAddress: '44:65:0D:33:F9:52',
    interfaceType: 'wifi-2.4',
    rssi: -65,
    brand: 'Amazon Technologies',
    deviceType: 'iot',
    downloadSpeedKbps: 80,
    uploadSpeedKbps: 45,
    isBlocked: false,
    staticIpReserved: false,
    connectedSince: '1d 19h'
  }
];

export const DEFAULT_WIFI_SETTINGS: WifiSettings = {
  band24: {
    enabled: true,
    ssid: 'FiberHome_WiFi_2.4G',
    broadcastSsid: true,
    securityMode: 'WPA2-PSK',
    encryption: 'AES',
    password: 'SuperFastFiber2026',
    channel: 'auto',
    bandwidth: '40MHz',
    txPowerPercent: 100
  },
  band50: {
    enabled: true,
    ssid: 'FiberHome_WiFi_5G_Ultra',
    broadcastSsid: true,
    securityMode: 'WPA2-PSK',
    encryption: 'AES',
    password: 'SuperFastFiber2026',
    channel: 'auto',
    bandwidth: '80MHz',
    txPowerPercent: 100
  },
  guestWifi: {
    enabled: false,
    ssid: 'FiberHome_Guest_Access',
    password: 'GuestWelcome2026',
    isolation: true,
    validHours: 24
  },
  wpsActive: false,
  wpsTimerSeconds: 0
};

export const DEFAULT_PORT_FORWARDING_RULES: PortForwardingRule[] = [
  {
    id: 'pf-1',
    serviceName: 'HTTP Web Server',
    protocol: 'TCP',
    externalPort: '8080',
    internalIp: '192.168.1.105',
    internalPort: '80',
    enabled: true
  },
  {
    id: 'pf-2',
    serviceName: 'SSH Secure Shell',
    protocol: 'TCP',
    externalPort: '2222',
    internalIp: '192.168.1.105',
    internalPort: '22',
    enabled: false
  },
  {
    id: 'pf-3',
    serviceName: 'Minecraft Game Server',
    protocol: 'TCP/UDP',
    externalPort: '25565',
    internalIp: '192.168.1.120',
    internalPort: '25565',
    enabled: true
  }
];

export const COMMON_GATEWAY_IPS = [
  { ip: '192.168.1.1', desc: 'Standard Default (ZTE, TP-Link, ASUS, D-Link, Netgear, Airtel)' },
  { ip: '192.168.100.1', desc: 'Huawei EchoLife GPON Default' },
  { ip: '192.168.18.1', desc: 'Huawei Newer Fiber Home Routers' },
  { ip: '192.168.0.1', desc: 'TP-Link / Tenda / D-Link secondary' },
  { ip: '192.168.29.1', desc: 'JioFiber Gateway Default' },
  { ip: '192.168.1.254', desc: 'Nokia / Alcatel Lucent GPON Gateway' },
  { ip: '10.0.0.1', desc: 'Xfinity / Comcast / Cisco Gateway' }
];
