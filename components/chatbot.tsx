"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

const predefinedResponses = {
  "what is bytewipe":
    "ByteWipe is a secure, cross-platform data wiping application that works on Windows, Linux, and Android devices. It ensures complete data destruction including hidden storage areas.",
  "how secure":
    "ByteWipe uses military-grade wiping algorithms and targets hidden storage areas like HPA/DCO and SSD spare sectors. All operations generate tamper-proof, digitally signed certificates.",
    "what is hpa and dco":
    "HPA (Host Protected Area) and DCO (Device Configuration Overlay) are hidden storage areas on hard drives that can store sensitive data. ByteWipe can secdurly wipe these areas to ensure complete data destruction.",
  platforms:
    "ByteWipe supports Windows, Linux, and Android platforms with native applications for each operating system.",
  certificate:
    "After each wipe operation, ByteWipe generates tamper-proof certificates in both PDF and JSON formats, digitally signed for verification.",
  "one click":
    "Yes! ByteWipe offers a simple one-click erase option that's perfect for both general users and IT recyclers.",
  pricing:
    "ByteWipe offers flexible pricing plans for individuals, businesses, and enterprise customers. Contact us for detailed pricing information.",
  support:
    "Our support team is available 24/7 to help with any questions about secure data wiping, compliance, or technical issues.",
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm here to help you with ByteWipe. Ask me about secure data wiping, platform support, or certificates!",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findBestResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowerQuery.includes(key) || key.split(" ").some((word) => lowerQuery.includes(word))) {
        return response
      }
    }

    // Default responses based on keywords
    if (lowerQuery.includes("help") || lowerQuery.includes("support")) {
      return "I'm here to help! You can ask me about ByteWipe's features, security, platform support, certificates, or pricing."
    }

    if (lowerQuery.includes("price") || lowerQuery.includes("cost")) {
      return predefinedResponses.pricing
    }

    return "I'd be happy to help! You can ask me about ByteWipe's security features, platform support, certificates, pricing, or any other questions about secure data wiping."
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findBestResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] animate-in slide-in-from-bottom-5 duration-300">
          <Card className="h-full flex flex-col shadow-2xl border-emerald-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">ByteWipe Assistant</h3>
                  <p className="text-sm text-emerald-100">Ask me anything about secure data wiping</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? "bg-emerald-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm shadow-sm border"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && <Bot className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />}
                      {message.isUser && <User className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg rounded-bl-sm shadow-sm border p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-emerald-600" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about ByteWipe features..."
                  className="flex-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 px-3"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
