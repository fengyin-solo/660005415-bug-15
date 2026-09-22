export interface LogEntry { id: number; timestamp: string; level: string; source: string; message: string; raw: string; matchedKeywords?: string[] }
export interface TimeWindow { start: number; end: number; count: number; levels: Record<string,number>; sources: Record<string,number> }
export interface AnomalyScore { windowIndex: number; sigmaScore: number; iqrScore: number; isAnomaly: boolean; timestamp: string }
export interface AlertRule { id: number; name: string; type: 'level' | 'count' | 'keyword' | string; threshold: number; enabled: boolean; keywords?: string[] }
export interface Alert { id: number; ruleName: string; severity: string; message: string; timestamp: string }
export interface KeywordHit { ruleId: number; ruleName: string; windowIndex: number; count: number; keywords: Record<string,number>; logIds: number[]; timestamp: string }
export interface DetectError { code: string; ruleId: number; ruleName: string; message: string }
export interface AnalysisResult { logs: LogEntry[]; windows: TimeWindow[]; anomalies: AnomalyScore[]; alerts: Alert[]; keywordHits: KeywordHit[]; errors: DetectError[]; totalLogs: number }
