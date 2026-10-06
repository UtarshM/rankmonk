export type AeoView = 
  | "overview" 
  | "prompt-generation" 
  | "crawler" 
  | "opportunities" 
  | "citations" 
  | "heatmap" 
  | "fanouts" 
  | "referrals";

export type AeoModelId = 
  | "gemini" 
  | "chatgpt" 
  | "claude" 
  | "perplexity" 
  | "deepseek" 
  | "grok" 
  | "claude_sonnet" 
  | "claude_opus";

export interface SeedPrompt {
  topic: string;
  prompt: string;
  rationale: string;
  category: "default" | "competitor" | "sector" | "custom";
}

export interface PromptObj {
  id?: string;
  topic: string;
  prompt: string;
  rationale?: string;
  is_active?: boolean;
  category?: string;
  selected?: boolean;
}

export interface TopicObj {
  topic: string;
  description: string;
  volume: "High" | "Medium" | "Low";
}

export interface AeoScanResult {
  model: string;
  rank: number | null;
  cited: boolean;
  source_urls: string[];
  snippet: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  competitor_mentions: string[];
}

export interface AeoAnalysisResult {
  overallScore: number;
  providers: {
    name: string;
    mentions: number;
    sentiment: "Positive" | "Neutral" | "Negative";
    citationShare: number;
  }[];
  categoryScores: {
    category: string;
    score: number;
  }[];
  recommendations: string[];
  promptSuggestions: string[];
}

export interface CitationItem {
  id: string;
  domain: string;
  url: string;
  count: number;
  model: string;
  snippet?: string;
  last_seen: string;
}
