import axios from "axios";
import { ChatRequest, ChatResponse } from "@/types/chat";

let rawURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
if (rawURL.endsWith("/")) {
  rawURL = rawURL.slice(0, -1);
}
const apiURL = rawURL.endsWith("/api") ? rawURL : `${rawURL}/api`;

const API = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendChatMessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  const response = await API.post<ChatResponse>("/chat", payload);
  return response.data;
};

export const getConversations = async (userId: string = "user-001"): Promise<any[]> => {
  const response = await API.get<any[]>("/conversations", { params: { user_id: userId } });
  return response.data;
};

export const getConversationDetails = async (sessionId: string, userId: string = "user-001"): Promise<any> => {
  const response = await API.get<any>(`/conversations/${sessionId}`, { params: { user_id: userId } });
  return response.data;
};
