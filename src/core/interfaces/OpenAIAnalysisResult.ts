export interface OpenAIAnalysisResult {
  accidentDetected: boolean;
  classification: string;
  licensePlate: string;
  gpsLocation?: string;
  distanceToUser?: number;
  gyroscopeData?: string;
}
