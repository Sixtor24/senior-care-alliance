export interface ChatItem {
    id: string;
    text: string;
}

export interface ChatSection {
    title: string;
    items: ChatItem[];
}

export type ChatHistory = ChatSection[];