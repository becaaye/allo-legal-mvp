"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  title: string
  preview: string
  date: string
}

interface ConversationListProps {
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
}

// Mock conversations for demonstration
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    title: "Prescription en droit civil",
    preview: "Question sur les délais de prescription...",
    date: "31/10/2025",
  },
  {
    id: "2",
    title: "Procédure de référé",
    preview: "Conditions pour une ordonnance de référé...",
    date: "30/10/2025",
  },
  {
    id: "3",
    title: "Clause compromissoire",
    preview: "Validité d'une clause d'arbitrage...",
    date: "29/10/2025",
  },
]

export function ConversationList({ currentConversationId, onSelectConversation }: ConversationListProps) {
  return (
    <ScrollArea className="flex-1 px-2">
      <div className="space-y-1 py-2">
        {MOCK_CONVERSATIONS.map((conversation) => {
          const isActive = currentConversationId === conversation.id

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all duration-150",
                "hover:bg-[#0A3D3D]/20",
                isActive && "bg-[#0A3D3D]/30",
              )}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-[#2DD4BF] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate line-clamp-2 mb-1">{conversation.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{conversation.preview}</p>
                  <p className="text-xs text-gray-500 mt-1">{conversation.date}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
}
