export interface Reel {
  id: string;
  caption: string;
  hashtags: string[];
  audioTrend: string;
  audioOriginal: boolean;
  videoLength: number; // in seconds
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagementRate: number; // calculated as ((likes + comments + shares) / views) * 100 or static followers percentage
  engagementScore: number; // weighted score
  category: string;
  region: string;
  country: string;
  username: string;
  postedAt: string; // ISO format or relative
}

export interface CategoryTrend {
  category: string;
  reelsCount: number;
  totalViews: number;
  avgEngagementRate: number;
  growth24h: number;     // percentage change
  growth7d: number;      // percentage change
  growth30d: number;     // percentage change
  topHashtags: string[];
  topAudio: string;
  description: string;
  sentiment: 'positive' | 'neutral' | 'highly_active' | 'explosive';
}

export interface GeographicZone {
  country: string;
  regions: string[];
}

export interface InsightReport {
  id: string;
  type: 'success' | 'warning' | 'info' | 'trend';
  title: string;
  text: string;
  growth?: number;
  categoryBound?: string;
  generatedAt: string;
}

export interface CustomDatasetUploadResponse {
  success: boolean;
  message: string;
  reelsAnalyzed: number;
  mergedCount: number;
}
