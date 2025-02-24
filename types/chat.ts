import { ActiveView } from "@/components/Sidebar";

export interface ChatItem {
    id: string;
    text: string;
    thread_id: string;
    timestamp: Date;
    type: 'user' | 'assistant';
}

export interface ChatSection {
    title: string;
    items: ChatItem[];
}

export interface SidebarProps {
    selectedItem: string;
    onSelectItem: (item: string) => void;
    isLoading: boolean;
    currentView: 'chat' | 'portfolio' | 'facility';
    activeView: ActiveView;
    onChangeView: (view: ActiveView) => void;
    loadConversation: (id: string) => void;
    conversations?: Conversation[];
    onRefreshConversations?: () => Promise<void>;
}

export interface Message {
    id: string;
    text: string;
    type: 'user' | 'assistant';
    timestamp: Date;
    thread_id: string;
    bigQueryData?: Array<Record<string, any>>;
}

export interface DashboardChatProps {
    title?: string;
    placeholder?: string;
    disclaimer?: string;
    onChatUpdated?: () => void;
    messages?: ChatMessage[];
    onSendMessage?: (message: string) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;       
}

export interface DashboardProps {
    isLoading?: boolean;
    conversations: Conversation[];
    onChatUpdated?: (newMessage: ChatMessage) => Promise<void>;
}

export interface Conversation {
    id: string;
    type: string;
    title: string;
    created_at: string;
    updated_at: string;
    facility_ccn: string | null;
    status: string;
  }
  
  export interface Message {
    id: string;
    role: string;
    content: string;
    created_at: string;
    message_metadata: any;
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
    type: 'user' | 'assistant';
}

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