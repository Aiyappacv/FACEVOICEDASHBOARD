/* ═══════════════════════════════════════════════════
   SPECTRAFACEVOICE — Application Type Definitions
   ═══════════════════════════════════════════════════ */

// ─── Navigation ───────────────────────────────────

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  badge?: number;
  children?: NavItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// ─── Dashboard KPIs ───────────────────────────────

export interface KPIMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'number' | 'percentage' | 'currency' | 'duration';
  icon: string;
  color: string;
  description?: string;
}

// ─── Biometric Types ──────────────────────────────

export interface FaceScan {
  id: string;
  timestamp: Date;
  confidence: number;
  quality: number;
  pose: { yaw: number; pitch: number; roll: number };
  lighting: number;
  occlusion: number;
  deepfakeScore: number;
  livenessScore: number;
  similarityScore: number;
  embedding: number[];
  landmarks: { x: number; y: number }[];
  boundingBox: { x: number; y: number; width: number; height: number };
}

export interface VoiceScan {
  id: string;
  timestamp: Date;
  confidence: number;
  language: string;
  noiseLevel: number;
  spoofDetection: number;
  voiceCloneProbability: number;
  embedding: number[];
  duration: number;
  sampleRate: number;
}

export interface FingerprintScan {
  id: string;
  timestamp: Date;
  quality: number;
  minutiaeCount: number;
  similarityScore: number;
  template: string;
  qualityMap: number[][];
}

// ─── Fusion Engine ────────────────────────────────

export interface FusionResult {
  id: string;
  userId: string;
  userName: string;
  faceScore: number;
  voiceScore: number | null;
  fingerprintScore: number | null;
  fusionScore: number;
  confidence: number;
  decision: 'approved' | 'rejected' | 'manual_review' | 'ALLOW' | 'DENY' | 'STEP-UP';
  latency: number;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

// ─── Security ─────────────────────────────────────

export interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  status: 'active' | 'mitigated' | 'investigating' | 'resolved' | 'contained' | 'mitigating';
  targetUser: string;
  confidence: number;
  location: string;
  mitigation: string;
}

export interface RiskEvent {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  userId: string;
  userName: string;
  description: string;
  riskScore: number;
  timestamp: Date;
  location: string;
  status: 'active' | 'acknowledged' | 'investigating' | 'resolved';
}

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

// ─── Identity ─────────────────────────────────────

export interface IdentityVerification {
  id: string;
  userId: string;
  userName: string;
  method: string;
  status: 'verified' | 'pending' | 'pending_review' | 'failed' | 'rejected' | 'expired';
  confidence: number;
  timestamp: Date;
  riskScore: number;
  location: string;
  device: string;
  modality: string;
  processingTime: number;
}

// ─── Audit ────────────────────────────────────────

export interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'warning' | 'blocked' | 'pending' | 'failed';
  category: string;
}

// ─── API Monitoring ───────────────────────────────

export interface APIMetric {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  latency: number;
  status: number;
  requests: number;
  errors: number;
  timestamp: Date;
}

// ─── Infrastructure ───────────────────────────────

export interface DeviceNode {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  throughput: number;
  latency: number;
  uptime: number;
  lastHeartbeat: Date;
}

// ─── AI Models ────────────────────────────────────

export interface AIModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  latency: number;
  totalRequests: number;
  successRate: number;
  lastUpdated: Date;
  gpuUsage: number;
  status: 'active' | 'deprecated' | 'healthy' | 'degraded' | 'offline';
  version: string;
}

// ─── Activity Feed ────────────────────────────────

export interface ActivityEvent {
  id: string;
  timestamp: Date;
  type:
    | 'identity_verified'
    | 'deepfake_blocked'
    | 'voice_clone_detected'
    | 'replay_attack'
    | 'fingerprint_match'
    | 'liveness_passed'
    | 'auth_failed'
    | 'api_connected'
    | 'model_updated'
    | 'risk_increased';
  message: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  user?: string;
  location?: string;
}

// ─── Compliance ───────────────────────────────────

export type ComplianceStatus = 'compliant' | 'partial' | 'non-compliant';

export interface ComplianceRequirement {
  id: string;
  title: string;
  status: ComplianceStatus;
  score: number;
  category: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  code: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number;
  lastAudit: Date;
  requirements: { total: number; met: number; partial: number; failed: number };
}

// ─── Cases ────────────────────────────────────────

export interface CaseInvestigation {
  id: string;
  caseNumber: string;
  title: string;
  status: 'open' | 'in_progress' | 'investigating' | 'contained' | 'monitoring' | 'resolved' | 'closed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee: string;
  createdAt: Date;
  updatedAt: Date;
  threatType: string;
  affectedUsers: number;
  riskScore: number;
  description: string;
  evidenceCount: number;
  relatedEvents: string[];
  tags: string[];
}

export interface CaseEvent {
  id: string;
  timestamp: Date;
  type: string;
  description: string;
  actor: string;
}

// ─── Map ──────────────────────────────────────────

export interface GeoEvent {
  id: string;
  lat: number;
  lng: number;
  type: string;
  intensity: number;
  timestamp: Date;
  country: string;
  city: string;
}

// ─── Pipeline ─────────────────────────────────────

export interface PipelineStage {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending' | 'error';
  duration?: number;
  icon: string;
}
