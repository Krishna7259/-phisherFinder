export type ScanVerdict = "SAFE" | "LOW_RISK" | "SUSPICIOUS" | "MALICIOUS";

export type IndicatorSeverity = "none" | "low" | "medium" | "high" | "critical";
export type IndicatorStatus = "pass" | "warning" | "danger" | "info";

export interface ThreatIndicator {
  category: string;
  name: string;
  status: IndicatorStatus;
  detail: string;
  severity: IndicatorSeverity;
}

export interface NetworkInfo {
  ip: string | null;
  hostingProvider: string | null;
  country: string | null;
  dnsResolved: boolean;
  redirectCount: number;
  redirectChain: string[];
  hasSsl: boolean;
  sslIssuer?: string;
  contentType?: string;
  httpStatus?: number;
}

export interface HeuristicDetails {
  isHomograph: boolean;
  homographDetails?: string;
  isIpAddress: boolean;
  isHighRiskTld: boolean;
  subdomainCount: number;
  entropyScore: number;
  hasSuspiciousKeywords: boolean;
  keywordsFound: string[];
  hasObfuscatedChars: boolean;
}

export interface AiThreatAnalysis {
  summary: string;
  socialEngineeringTactics: string[];
  urgencyScore: number;
  recommendation: string;
  victimActionSteps: string[];
  confidence: number;
}

export interface ScanResult {
  id: string;
  url: string;
  normalizedUrl: string;
  hostname: string;
  protocol: string;
  scannedAt: string;
  verdict: ScanVerdict;
  threatScore: number; // 0 to 100
  threatLevel: string;
  summary: string;
  targetedBrand: string | null;
  threatType: string;
  indicators: ThreatIndicator[];
  networkInfo: NetworkInfo;
  heuristicDetails: HeuristicDetails;
  aiAnalysis: AiThreatAnalysis | null;
}

export interface ThreatCampaign {
  id: string;
  title: string;
  vector: string;
  targetedBrands: string[];
  typicalDomains: string[];
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  discoveredDaysAgo: number;
}

export interface ThreatFeedData {
  updatedAt: string;
  activeCampaigns: ThreatCampaign[];
  statistics: {
    linksScannedToday: number;
    threatsNeutralized: number;
    averageAnalysisTimeMs: number;
    globalProtectionCoverage: string;
  };
}
