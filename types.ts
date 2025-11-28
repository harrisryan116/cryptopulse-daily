export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  tag: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  rawText?: string;
  groundingMetadata?: GroundingMetadata;
}

export interface NewsResponse {
  items: NewsItem[];
  rawContent?: string;
  groundingMetadata?: GroundingMetadata;
}
