"use client"

import { FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
}

export function ConversationList({ currentConversationId, onSelectConversation }: ConversationListProps) {
  // Pour le MVP, afficher seulement la conversation en cours
  const currentConversation = {
    id: "current",
    title: "Conversation 1",
    preview: "Question en cours...",
    date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <ScrollArea className="flex-1 px-2">
      <div className="space-y-1 py-2">
        <button
          onClick={() => onSelectConversation(currentConversation.id)}
          className={cn(
            "w-full text-left p-3 rounded-lg transition-colors",
            "hover:bg-white/5",
            currentConversationId === currentConversation.id && "bg-[#0A3D3D]/20"
          )}
        >
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-[#2DD4BF] mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white truncate">
                {currentConversation.title}
              </h3>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {currentConversation.preview}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentConversation.date}
              </p>
            </div>
          </div>
        </button>
      </div>
    </ScrollArea>
  )
}
