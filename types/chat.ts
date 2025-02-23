export interface ChatItem {
    id: string;
    text: string;
    thread_id: string;
    timestamp: Date;
}

export interface ChatSection {
    title: string;
    items: ChatItem[];
}

export interface ChatRequest {
    message: string;
    thread_id: string;
}

export interface ChatResponse {
    response: string;
    thread_id: string;
    bigquery_data: Record<string, any>[];
    message?: string;
}

export interface ThreadHistoryResponse {
    messages: {
        id: string;
        text: string;
        type: 'user' | 'assistant';
        timestamp: string;
    }[];
    thread_id: string;
}

export interface SaveChatParams {
    id: string;
    text: string;
    timestamp: Date;
    thread_id: string;
}

export type ChatHistory = ChatSection[];

export interface ChatMessage {
    id: string;
    text: string;
    type: 'user' | 'assistant';
    timestamp: Date;
    bigquery_data?: Array<any>;
    thread_id: string;
    message?: string;
    context?: string;
    metadata?: {
        facilityId?: string;
        userId?: string;
    };
}