"use client"

import { Scale, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [isSourcesOpen, setIsSourcesOpen] = useState(false)

  // Extract sources from message content (format: [Source: title | author])
  const sourceRegex = /\[Source:\s*([^|]+)\|\s*([^\]]+)\]/g
  const sources: Array<{ title: string; author: string }> = []
  let match

  while ((match = sourceRegex.exec(message.content)) !== null) {
    sources.push({ title: match[1].trim(), author: match[2].trim() })
  }

  // Remove source tags from content for display
  const cleanContent = message.content.replace(sourceRegex, "").trim()

  const isUser = message.role === "user"
  const timestamp = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end animate-in fade-in duration-200">
        <div className="flex-1 flex flex-col items-end">
          <div className="bg-[#0A3D3D] text-white rounded-2xl rounded-tr-sm p-4 max-w-[80%] shadow-sm">
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FCD34D]/20 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-[#FCD34D]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/20 flex items-center justify-center shrink-0">
        <Scale className="w-4 h-4 text-[#2DD4BF]" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 max-w-[80%] shadow-sm">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-900">{cleanContent}</p>
        </div>

        {/* Sources Section */}
        {sources.length > 0 && (
          <div className="mt-3 max-w-[80%]">
            <Collapsible open={isSourcesOpen} onOpenChange={setIsSourcesOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <ChevronDown className={`w-4 h-4 transition-transform ${isSourcesOpen ? "rotate-180" : ""}`} />
                <span className="font-medium">Sources consultées:</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                {sources.map((source, index) => (
                  <div key={index} className="bg-[#FEF3C7] rounded-lg p-3 border border-[#FCD34D]/20 shadow-sm">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">{source.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#0A3D3D] text-white hover:bg-[#0A3D3D]/90">Procédure Civile</Badge>
                          <span className="text-xs text-gray-700">Par {source.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
      </div>
    </div>
  )
}
