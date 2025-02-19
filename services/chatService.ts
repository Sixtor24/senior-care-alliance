import { ChatHistory, ChatItem } from "@/types/chat";

// Mock data - will be replaced with actual API calls later
const mockChatHistory: ChatHistory = [
    {
        title: "Yesterday",
        items: [
            { id: 'chat1', text: 'Chat History 1' },
            { id: 'chat2', text: 'Chat History 2' },
            { id: 'chat3', text: 'Chat History 3' },
        ]
    },
    {
        title: "30 days before",
        items: [
            { id: 'chat4', text: 'Chat History 1' },
            { id: 'chat5', text: 'Chat History 2' },
            { id: 'chat6', text: 'Chat History 3' },
        ]
    },
    {
        title: "january",
        items: [
            { id: 'chat7', text: 'Chat History 1' },
            { id: 'chat8', text: 'Chat History 2' },
            { id: 'chat9', text: 'Chat History 3' },
        ]
    }
];

class ChatService {
    // Get all chat history
    async getChatHistory(): Promise<ChatHistory> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockChatHistory;
    }

    // Get chat history by date range
    async getChatHistoryByDateRange(startDate: Date, endDate: Date): Promise<ChatHistory> {
        // This will be implemented with real API
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockChatHistory;
    }

    // Get chat by ID
    async getChatById(chatId: string): Promise<ChatItem | null> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const chat = mockChatHistory
            .flatMap(section => section.items)
            .find(item => item.id === chatId);
        return chat || null;
    }
}

// Export a singleton instance
export const chatService = new ChatService();