
export interface NewsItemMetadata {
  language: string;
  mediaType: string;
  source: {
    name: string;
    country: string;
  };
  docDate: string;
  physicalPosition: string;
  logicalPosition: {
    value: string;
    type: string;
  };
}

export interface NewsItem {
  id: string;
  filename: string;
  headline: string;
  subheadline: string;
  intro: string;
  story: string;
  byline: string;
  metadata: NewsItemMetadata;
  aiSummary?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}
