export type ChartSpec = {
  chart_type: string;
  title: string;
  description?: string;
  data: Array<Record<string, any>>;
  x_axis: string;
  y_axis: string[];
  dimensions?: string[];
  aggregations?: Record<string, string>;
  metadata?: Record<string, any>;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  created_at: string;
  chart?: ChartSpec;
  kpis?: Array<Record<string, any>>;
  metadata?: Record<string, any>;
};

export type ChatRequest = {
  session_id: string;
  user_id: string;
  message: string;
  conversation_id?: string;
  channel?: string;
  context?: Record<string, any>;
};

export type ChatResponse = {
  session_id: string;
  conversation_id: string;
  messages: ChatMessage[];
  charts?: ChartSpec[];
  semantic_intent?: string;
  tool_results?: Array<Record<string, any>>;
  warnings?: string[];
  stream_token?: string;
};
