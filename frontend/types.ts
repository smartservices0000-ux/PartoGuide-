
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: Date;
}

export interface AnalysisResult {
  summary: string;
  fetalHeartRate: string;
  cervicalDilation: string;
  contractions: string;
  maternalStatus: string;
  recommendations: string;
}
