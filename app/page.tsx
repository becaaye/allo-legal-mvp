"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Plus, Send, Scale, User, Landmark, Home, Briefcase, ShoppingBag, Shield, FileText, Mic } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { ConversationList } from "@/components/conversation-list"

const LEGAL_DOMAINS = [
  { id: "civil", name: "Droit Civil", count: 342, icon: Landmark, disabled: true },
  { id: "family", name: "Droit de la Famille", count: 178, icon: Home, disabled: true },
  { id: "labor", name: "Droit du Travail", count: 256, icon: Briefcase, disabled: true },
  { id: "commercial", name: "Droit Commercial", count: 198, icon: ShoppingBag, disabled: true },
  { id: "penal", name: "Droit Pénal", count: 145, icon: Shield, disabled: true },
  { id: "procedure", name: "Procédure Civile", count: 128, icon: FileText, disabled: false },
]

export default function ChatInterface() {
  const [selectedDomain, setSelectedDomain] = useState("procedure")
  const [currentConversationId, setCurrentConversationId] = useState<string>("current")
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    onFinish: () => {
      // Focus textarea après réponse
      textareaRef.current?.focus()
    }
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Message initial de bienvenue
  const initialMessage = {
    id: "initial",
    role: "assistant" as const,
    content: `Bonjour ! Je suis votre mentor intelligent juridique. Je peux vous aider à trouver des réponses à vos questions juridiques en me basant sur notre base de connaissances élaborée par des avocats seniors expérimentés et des documents juridiques internes et externes pertinents.

N'hésitez pas à utiliser l'enregistrement vocal pour que je puisse mieux comprendre votre situation.`,
  }

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleNewConversation = () => {
    window.location.reload()
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Vérification de sécurité pour input
    if (!input?.trim()) return

    // Envoyer le message avec sendMessage (AI SDK v5)
    await sendMessage({ text: input })
    setInput("") // Réinitialiser l'input après envoi

    // Focus textarea après envoi
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-[280px] bg-primary flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-white">Conversations</h2>
          </div>

          <Button
            onClick={handleNewConversation}
            className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-primary font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        <Separator className="bg-white/10" />

        {/* Conversations List */}
        <ConversationList
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversationId}
        />

        {/* Sidebar Footer */}
        <div className="mt-auto p-4 border-t border-white/10">
          <p className="text-xs font-medium text-secondary mb-2">Base de connaissances:</p>
          <ul className="space-y-1 text-xs text-gray-400">
            <li>• 1,247 articles juridiques</li>
            <li>• 89 avocats seniors contributeurs</li>
            <li>• Documents juridiques internes et externes</li>
          </ul>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex flex-col">
          {/* Section 1: Logo et titre avec background primaire */}
          <div className="bg-primary px-6 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/allo-legal-logo.png"
                alt="Allô Légal Logo"
                width={32}
                height={32}
                className="shrink-0"
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-white">Allô Légal</h2>
                <p className="text-sm text-secondary">Mentorat juridique à portée de main</p>
              </div>
            </div>
          </div>

          {/* Section 2: Domain Selection avec padding gauche/droite */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-gray-500 mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Sélectionnez votre domaine de droit</p>
                <div className="flex flex-wrap gap-2">
                  {LEGAL_DOMAINS.map((domain) => {
                    const Icon = domain.icon
                    const isSelected = selectedDomain === domain.id

                    return (
                      <Button
                        key={domain.id}
                        variant="outline"
                        size="sm"
                        disabled={domain.disabled}
                        onClick={() => !domain.disabled && setSelectedDomain(domain.id)}
                        className={`
                          ${isSelected
                            ? "bg-primary text-white border-primary hover:bg-primary/90"
                            : domain.disabled
                              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                              : "bg-secondary/10 text-primary border-secondary/30 hover:bg-secondary/20"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {domain.name}
                        <Badge
                          variant="secondary"
                          className={`ml-2 ${isSelected ? "bg-secondary text-primary" : "bg-gray-200 text-gray-700"}`}
                        >
                          {domain.count}
                        </Badge>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Message initial de bienvenue */}
            {messages.length === 0 && (
              <ChatMessage key={initialMessage.id} message={initialMessage} />
            )}

            {messages.map((message) => {
              // Convertir UIMessage (avec parts) en Message (avec content) pour ChatMessage
              const content = message.parts
                .filter((part) => part.type === "text")
                .map((part) => (part as { type: "text"; text: string }).text)
                .join("")

              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    id: message.id,
                    role: message.role,
                    content: content || "",
                  }}
                />
              )
            })}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="bg-white text-gray-900 rounded-2xl rounded-tl-sm p-4 max-w-[80%] shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">En train de réfléchir</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="shrink-0 h-[56px] w-[56px] border-gray-300 hover:bg-gray-50"
              >
                <Mic className="w-5 h-5 text-gray-600" />
              </Button>

              <div className="flex-1 relative">
                <div className="bg-white rounded-lg px-4 py-2 border border-gray-300 focus-within:border-secondary transition-colors shadow-sm">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question juridique ou utilisez le micro..."
                    className="flex-1 bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder:text-gray-400 min-h-[40px] max-h-[120px]"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        // Vérification de sécurité avant d'envoyer
                        if (input?.trim()) {
                          sendMessage({ text: input })
                          setInput("")
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="icon"
                disabled={!input?.trim() || isLoading}
                className="shrink-0 bg-secondary hover:bg-secondary/90 text-primary disabled:bg-gray-200 disabled:text-gray-400 h-[56px] w-[56px] transition-transform active:scale-95"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
