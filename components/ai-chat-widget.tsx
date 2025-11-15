'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Maximize2, Minimize2, Send, Shield, AlertTriangle, Lock, Zap, X } from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const QUICK_ACTIONS = [
  { icon: Shield, label: 'Vulnerability Scan', query: 'How do I scan for vulnerabilities?' },
  { icon: AlertTriangle, label: 'Setup Alerts', query: 'How do I setup security alerts?' },
  { icon: Lock, label: 'Integration Help', query: 'How do I integrate services?' },
  { icon: Zap, label: 'Security Tips', query: 'Give me security best practices' },
]

interface AIChatWidgetProps {
  isLandingPage?: boolean
}

export function AIChatWidget({ isLandingPage = false }: AIChatWidgetProps) {
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [showPulse, setShowPulse] = useState(false)
  const hasAutoOpenedRef = useRef(false)
  const inactivityTimerRef = useRef<NodeJS.Timeout>()
  
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    if (isLandingPage) return
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLandingPage])

  useEffect(() => {
    const loadUserAndMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUserId(user.id)
        
        // Load chat history from database
        const { data: chatHistory } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(50)
        
        if (chatHistory && chatHistory.length > 0) {
          setMessages(chatHistory.map(msg => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })))
        } else {
          // First time user, add greeting
          setMessages([
            {
              id: 'greeting',
              role: 'assistant',
              content: "Hi, I'm Agentia v1.0! 👋 I'm your SecurityX AI assistant. Ask me anything about security, vulnerabilities, or our platform!",
            }
          ])
        }
      }
    }
    
    loadUserAndMessages()
  }, [])

  useEffect(() => {
    if (isLandingPage && !hasAutoOpenedRef.current) {
      const openTimer = setTimeout(() => {
        setIsOpen(true)
        hasAutoOpenedRef.current = true
        setMessages([
          {
            id: 'greeting',
            role: 'assistant',
            content: "Hi, I'm Agentia v1.0! 👋 I'm your SecurityX AI assistant. Ask me anything about security, vulnerabilities, or our platform!",
          }
        ])
        
        setTimeout(() => {
          setIsOpen(false)
        }, 3000)
      }, 5000)

      return () => clearTimeout(openTimer)
    }
  }, [isLandingPage])

  const saveMessageToDb = async (role: 'user' | 'assistant', content: string) => {
    if (!userId) return
    
    try {
      await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          role,
          content
        })
    } catch (error) {
      console.error('[v0] Error saving message:', error)
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const lowerText = text.toLowerCase()
    
    if (lowerText.match(/^(hi|hey|hello|sup|yo|howdy|greetings)/)) {
      const greetings = [
        "Hey there! 👋 I'm Agentia, your security assistant. How can I help you today?",
        "Hello! Great to see you! I'm here to help with all your security questions.",
        "Hi! 😊 Ready to make your platform more secure? What would you like to know?",
        "Hey! I'm Agentia v1.0, your SecurityX AI. Ask me anything about security!",
      ]
      const greeting = greetings[Math.floor(Math.random() * greetings.length)]
      
      const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text }
      const botMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: greeting }
      
      setMessages((prev) => [...prev, userMessage, botMessage])
      setInput('')
      
      if (!isOpen) {
        setShowPulse(true)
        setTimeout(() => setShowPulse(false), 3000)
      }
      
      await saveMessageToDb('user', text)
      await saveMessageToDb('assistant', greeting)
      return
    }

    if (lowerText.includes('what is this') || lowerText.includes('what\'s this') || lowerText.includes('about') || lowerText.includes('explain')) {
      const aboutResponse = `SecurityX is a comprehensive security platform that helps you:

🔒 **Scan for Vulnerabilities** - Automatically detect security flaws like SQL injection, XSS, CSRF, and more
🚨 **Manage Alerts** - Get real-time notifications for security threats and anomalies
🔗 **Integrate Services** - Connect Slack, Kubernetes, Grafana, Prometheus, Docker, PostgreSQL and more
📊 **Monitor Analytics** - Track security metrics, compliance scores, and threat trends
🛡️ **Best Practices** - Learn OWASP guidelines, secure coding patterns, and security audits
🤖 **AI-Powered** - Intelligent threat detection and automated security recommendations
📈 **Activity Tracking** - Monitor API calls, user activity, and system events

I'm Agentia v1.0, your AI assistant here to help you navigate all these features. What would you like to explore?`
      
      const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text }
      const botMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: aboutResponse }
      
      setMessages((prev) => [...prev, userMessage, botMessage])
      setInput('')
      
      if (!isOpen) {
        setShowPulse(true)
        setTimeout(() => setShowPulse(false), 3000)
      }
      
      await saveMessageToDb('user', text)
      await saveMessageToDb('assistant', aboutResponse)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    await saveMessageToDb('user', text)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              id: m.id,
              role: m.role,
              parts: [{ type: 'text', text: m.content }],
            })),
            {
              id: userMessage.id,
              role: 'user',
              parts: [{ type: 'text', text: text }],
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter((line) => line.trim())
          for (const line of lines) {
            if (line.startsWith('0:')) {
              const data = JSON.parse(line.slice(2))
              if (data.type === 'text') {
                assistantText = data.text
              }
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantText || 'Sorry, I encountered an error. Please try again.',
      }

      setMessages((prev) => [...prev, assistantMessage])
      
      if (!isOpen) {
        setShowPulse(true)
        setTimeout(() => setShowPulse(false), 3000)
      }
      
      await saveMessageToDb('assistant', assistantText || 'Sorry, I encountered an error. Please try again.')
    } catch (error) {
      console.error('[v0] Chat error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or ask me something else!',
      }
      setMessages((prev) => [...prev, errorMessage])
      
      await saveMessageToDb('assistant', errorMessage.content)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = () => sendMessage(input)

  const handleQuickAction = (query: string) => {
    sendMessage(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getButtonPosition = () => {
    if (isLandingPage) {
      return { position: 'fixed' as const, bottom: '24px', right: '24px' }
    }
    
    // Always position relative to current viewport
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    const topPosition = viewportHeight * 0.2 // 20% from top of viewport
    
    return {
      position: 'fixed' as const,
      top: `${topPosition}px`,
      right: '24px'
    }
  }

  const getWidgetPosition = () => {
    if (isLandingPage || isFullscreen) {
      return { position: 'fixed' as const, bottom: '24px', right: '24px' }
    }
    
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    const topPosition = viewportHeight * 0.15
    
    return {
      position: 'fixed' as const,
      top: `${topPosition}px`,
      right: '24px'
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`z-50 w-16 h-16 btn-shiny rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 ${showPulse ? 'animate-pulse-wave' : ''}`}
        style={{
          ...getButtonPosition(),
          animation: showPulse ? 'pulse-wave 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, bounce 1s infinite' : 'float 3s ease-in-out infinite'
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8e325b3c1314f5504ae8b440d488f4de-mkYNyroshqSityT0Xzeo6jfGOXhFz0.jpg"
          alt="Agentia AI"
          width={48}
          height={48}
          className="rounded-full"
        />
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <span className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse" />
      </button>
    )
  }

  return (
    <div
      className={`z-50 glass-strong shadow-2xl transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-4 flex flex-col animate-float ${
        isFullscreen
          ? 'inset-4 rounded-2xl'
          : 'w-[280px] h-[420px] rounded-2xl'
      }`}
      style={!isFullscreen ? getWidgetPosition() : { position: 'fixed', inset: '16px' }}
    >
      <div className="flex items-center justify-between p-2.5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8e325b3c1314f5504ae8b440d488f4de-mkYNyroshqSityT0Xzeo6jfGOXhFz0.jpg"
            alt="Agentia AI"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="text-[11px] font-semibold">Agentia v1.0</p>
            <p className="text-[9px] text-muted-foreground">SecurityX AI</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-destructive/10"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
        {messages.length === 1 && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-border hover:bg-secondary/50 hover:scale-105 transition-all duration-300 group"
                >
                  <action.icon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-medium text-center leading-tight">{action.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="max-w-[85%] rounded-xl px-2 py-1.5 bg-secondary/50 text-foreground border border-border text-[11px]">
                {messages[0].content}
              </div>
            </div>
          </div>
        )}

        {messages.slice(1).map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-2 py-1.5 text-[11px] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-foreground border border-border'
              }`}
            >
              <p className="text-[11px] leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="max-w-[85%] rounded-xl px-2 py-1.5 bg-secondary/50 border border-border">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <p className="text-[9px] text-muted-foreground">Thinking...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-border flex-shrink-0">
        <div className="flex gap-1.5">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about security..."
            disabled={isLoading}
            className="bg-secondary/50 border-border text-[11px] h-7"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="btn-shiny flex-shrink-0 h-7 px-2 border-0"
          >
            <Send className="w-3 h-3 text-primary-foreground" />
          </Button>
        </div>
        <p className="text-[9px] text-muted-foreground mt-1 text-center">
          Powered by Agentia v1.0
        </p>
      </div>
    </div>
  )
}
