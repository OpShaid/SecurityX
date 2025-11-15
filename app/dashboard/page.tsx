'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SecurityXLogo } from '@/components/securityx-logo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SecurityScore } from '@/components/security-score'
import { ActivityTimeline } from '@/components/activity-timeline'
import { Lock, Shield, AlertTriangle, Bell, Settings, LogOut, Copy, Check, Eye, EyeOff, Mail, User, Building, ChevronRight, ChevronDown, ArrowDown, Menu, X, Home, Activity, FileText, BarChart } from 'lucide-react'
import { AIChatWidget } from '@/components/ai-chat-widget'
import { VortexLoader } from '@/components/vortex-loader'
import { ProfileDropdown } from '@/components/profile-dropdown'

interface Notification {
  id: string
  message: string
  timestamp: Date
  read: boolean
}

interface Integration {
  name: string
  icon: string
  available: boolean
  connected: boolean
  fields: Array<{ name: string; label: string; type: string; placeholder: string; required: boolean }>
  credentials: Record<string, string>
}

interface Vulnerability {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  affectedAssets: string[]
  cve?: string
}

export default function DashboardPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showMenuTutorial, setShowMenuTutorial] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('home')
  
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [showApiId, setShowApiId] = useState(false)
  const [showProxyId, setShowProxyId] = useState(false)
  const [copiedApi, setCopiedApi] = useState(false)
  const [copiedProxy, setCopiedProxy] = useState(false)
  const [apiId] = useState('sx_api_' + Math.random().toString(36).substring(2, 15))
  const [proxyId] = useState('sx_proxy_' + Math.random().toString(36).substring(2, 15))
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length
  
  const [settingsForm, setSettingsForm] = useState({
    email: '',
    company: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [settingsErrors, setSettingsErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    { 
      name: 'Slack', 
      icon: '💬', 
      available: true, 
      connected: false,
      fields: [
        { name: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.slack.com/services/...', required: true },
        { name: 'channel', label: 'Channel Name', type: 'text', placeholder: '#security-alerts', required: true },
        { name: 'botToken', label: 'Bot Token', type: 'password', placeholder: 'xoxb-...', required: false }
      ],
      credentials: {}
    },
    { 
      name: 'Kubernetes', 
      icon: '☸️', 
      available: true, 
      connected: false,
      fields: [
        { name: 'apiServer', label: 'API Server URL', type: 'text', placeholder: 'https://your-cluster.example.com', required: true },
        { name: 'token', label: 'Service Account Token', type: 'password', placeholder: 'eyJhbGciOiJSUzI1NiIs...', required: true },
        { name: 'namespace', label: 'Namespace', type: 'text', placeholder: 'default', required: false }
      ],
      credentials: {}
    },
    { 
      name: 'Grafana', 
      icon: '📊', 
      available: true, 
      connected: false,
      fields: [
        { name: 'url', label: 'Grafana URL', type: 'text', placeholder: 'https://grafana.example.com', required: true },
        { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'glsa_...', required: true }
      ],
      credentials: {}
    },
    { 
      name: 'Prometheus', 
      icon: '🔥', 
      available: true, 
      connected: false,
      fields: [
        { name: 'url', label: 'Prometheus URL', type: 'text', placeholder: 'https://prometheus.example.com', required: true },
        { name: 'username', label: 'Username', type: 'text', placeholder: 'admin', required: false },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'password', required: false }
      ],
      credentials: {}
    },
    { 
      name: 'Docker', 
      icon: '🐳', 
      available: false, 
      connected: false,
      fields: [],
      credentials: {}
    },
    { 
      name: 'PostgreSQL', 
      icon: '🐘', 
      available: false, 
      connected: false,
      fields: [],
      credentials: {}
    },
    { 
      name: 'MySQL', 
      icon: '🗄️', 
      available: false, 
      connected: false,
      fields: [],
      credentials: {}
    },
    { 
      name: 'Redis', 
      icon: '⚡', 
      available: false, 
      connected: false,
      fields: [],
      credentials: {}
    },
  ])

  const [expandedIntegration, setExpandedIntegration] = useState<number | null>(null)
  const [expandedVulnerability, setExpandedVulnerability] = useState<string | null>(null)
  const [showVulnerabilities, setShowVulnerabilities] = useState(true)
  
  const [showVulnGuide, setShowVulnGuide] = useState(true)
  const [vulnSectionVisible, setVulnSectionVisible] = useState(false)

  const [vulnerabilities] = useState<Vulnerability[]>([])

  const [showVortexLoader, setShowVortexLoader] = useState(true)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('[v0] Dashboard vortex loader complete')
      setShowVortexLoader(false)
      
      const hasSeenTutorial = localStorage.getItem('hasSeenMenuTutorial')
      if (!hasSeenTutorial) {
        setTimeout(() => {
          setShowMenuTutorial(true)
        }, 500)
      }
    }, 3000) // Reduced dashboard loader from 6 seconds to 3 seconds
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const loadUserData = async () => {
      console.log('[v0] Loading user data...')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        console.log('[v0] User logged in:', user.id)
        setUserId(user.id)
        
        try {
          const { data: existingProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()
          
          if (existingProfile) {
            setUserName(existingProfile.full_name || 'User')
          } else {
            setUserName(user.user_metadata?.full_name || 'User')
          }
          
          if (!existingProfile) {
            console.log('[v0] No profile found, creating profile from pending data...')
            
            const pendingData = localStorage.getItem('pendingProfileData')
            const pendingAvatar = localStorage.getItem('pendingAvatar')
            const pendingAvatarName = localStorage.getItem('pendingAvatarName')
            
            let avatarUrl = null
            
            if (pendingAvatar && pendingAvatarName) {
              try {
                console.log('[v0] Uploading pending avatar...')
                // Convert base64 to blob
                const response = await fetch(pendingAvatar)
                const blob = await response.blob()
                
                const fileExt = pendingAvatarName.split('.').pop()
                const fileName = `${user.id}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                const { error: uploadError } = await supabase.storage
                  .from('avatars')
                  .upload(filePath, blob, {
                    upsert: true
                  })

                if (!uploadError) {
                  const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath)
                  
                  avatarUrl = publicUrl
                  console.log('[v0] Avatar uploaded successfully:', avatarUrl)
                }
                
                // Clean up localStorage
                localStorage.removeItem('pendingAvatar')
                localStorage.removeItem('pendingAvatarName')
              } catch (error) {
                console.error('[v0] Avatar upload failed:', error)
              }
            }
            
            const profileData = pendingData ? JSON.parse(pendingData) : {
              full_name: user.user_metadata?.full_name || 'User',
              email: user.email || ''
            }
            
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: profileData.email,
                full_name: profileData.full_name,
                avatar_url: avatarUrl,
              })

            if (profileError) {
              console.error('[v0] Profile creation error:', profileError)
            } else {
              console.log('[v0] Profile created successfully!')
              localStorage.removeItem('pendingProfileData')
              
              const welcomeNotification: Notification = {
                id: Date.now().toString(),
                message: `Welcome ${profileData.full_name}! Your account has been set up successfully.`,
                timestamp: new Date(),
                read: false
              }
              setNotifications(prev => [welcomeNotification, ...prev])
            }
          }
          
          // Load integrations from database
          const { data: savedIntegrations } = await supabase
            .from('integrations')
            .select('*')
            .eq('user_id', user.id)
          
          if (savedIntegrations && savedIntegrations.length > 0) {
            setIntegrations(prev => prev.map(integration => {
              const saved = savedIntegrations.find(s => s.integration_name === integration.name)
              if (saved) {
                return {
                  ...integration,
                  connected: saved.connected,
                  credentials: saved.credentials as Record<string, string>
                }
              }
              return integration
            }))
          }
        } catch (error) {
          console.log('[v0] Database tables not ready yet, using fallback storage:', error)
          // Load from localStorage as fallback
          const stored = localStorage.getItem(`integrations_${user.id}`)
          if (stored) {
            try {
              const parsedIntegrations = JSON.parse(stored)
              setIntegrations(parsedIntegrations)
            } catch (e) {
              console.error('[v0] Error parsing stored integrations')
            }
          }
        }
      } else {
        console.log('[v0] No user found, redirecting to sign up')
        window.location.href = '/auth/sign-up'
      }
    }
    
    loadUserData()
  }, [])

  const copyToClipboard = (text: string, type: 'api' | 'proxy') => {
    navigator.clipboard.writeText(text)
    if (type === 'api') {
      setCopiedApi(true)
      setTimeout(() => setCopiedApi(false), 2000)
    } else {
      setCopiedProxy(true)
      setTimeout(() => setCopiedProxy(false), 2000)
    }
  }

  const handleIntegrationConnect = async (index: number) => {
    const integration = integrations[index]
    const allRequiredFieldsFilled = integration.fields
      .filter(f => f.required)
      .every(f => integration.credentials[f.name]?.trim())
    
    if (!allRequiredFieldsFilled || !userId) {
      return
    }

    const updated = [...integrations]
    updated[index].connected = true
    setIntegrations(updated)
    setExpandedIntegration(null)
    
    try {
      await supabase
        .from('integrations')
        .upsert({
          user_id: userId,
          integration_name: integration.name,
          credentials: integration.credentials,
          connected: true
        }, {
          onConflict: 'user_id,integration_name'
        })
      console.log('[v0] Integration saved to database')
    } catch (error) {
      console.log('[v0] Database not ready, saving to localStorage:', error)
      localStorage.setItem(`integrations_${userId}`, JSON.stringify(updated))
    }
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: `${updated[index].name} integration connected successfully!`,
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const handleCredentialChange = (integrationIndex: number, fieldName: string, value: string) => {
    const updated = [...integrations]
    updated[integrationIndex].credentials[fieldName] = value
    setIntegrations(updated)
  }

  const scrollToIntegrations = () => {
    setActiveSection('integrations')
    setIsDrawerOpen(false)
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const validateSettings = (field: string, value: string) => {
    const errors: Record<string, string> = { ...settingsErrors }
    
    if (field === 'email') {
      if (!value) {
        errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.email = 'Please enter a valid email address'
      } else {
        delete errors.email
      }
    }
    
    if (field === 'newPassword' && value) {
      if (value.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters'
      } else {
        delete errors.newPassword
      }
    }
    
    if (field === 'confirmPassword' && settingsForm.newPassword) {
      if (value !== settingsForm.newPassword) {
        errors.confirmPassword = 'Passwords do not match'
      } else {
        delete errors.confirmPassword
      }
    }
    
    setSettingsErrors(errors)
  }

  const handleSettingsChange = (field: string, value: string) => {
    setSettingsForm(prev => ({ ...prev, [field]: value }))
    validateSettings(field, value)
  }

  const handleSaveSettings = async () => {
    // Validate all fields
    validateSettings('email', settingsForm.email)
    
    if (Object.keys(settingsErrors).length > 0) {
      return
    }
    
    setLoadingMessage('Saving settings...')
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setLoadingMessage('')
    
    // Add notification
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: 'Settings saved successfully!',
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const handleUpdatePassword = async () => {
    validateSettings('newPassword', settingsForm.newPassword)
    validateSettings('confirmPassword', settingsForm.confirmPassword)
    
    if (settingsErrors.newPassword || settingsErrors.confirmPassword || !settingsForm.currentPassword) {
      return
    }
    
    setLoadingMessage('Updating password...')
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setLoadingMessage('')
    
    // Clear password fields
    setSettingsForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: 'Password updated successfully!',
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30'
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/30'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30'
    }
  }

  const handleVulnerabilityGetStarted = () => {
    setShowVulnerabilities(false)
    setVulnSectionVisible(false) // Add this line
    setTimeout(() => scrollToIntegrations(), 300)
  }

  const handleGuideClick = () => {
    setShowVulnGuide(false)
    setVulnSectionVisible(true)
  }
  
  const handleMenuClick = () => {
    setIsDrawerOpen(true)
    if (showMenuTutorial) {
      setShowMenuTutorial(false)
      localStorage.setItem('hasSeenMenuTutorial', 'true')
    }
  }

  const navigateTo = (section: string) => {
    setActiveSection(section)
    setIsDrawerOpen(false)
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="dashboard-bg">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cyber-background-mboy3w2gf6c93ram-QklUOEu3N92cEBzWcybjfTtOdpRCtX.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {showVortexLoader && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://i.pinimg.com/originals/15/2a/c9/152ac925a89821541f304410fa6e3ee8.gif"
              alt="Vortex background"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </div>
          
          <div className="relative z-10 text-center space-y-4">
            <p className="text-4xl font-bold text-white drop-shadow-lg">SecurityX</p>
            <p className="text-xl text-gray-200 drop-shadow-md animate-pulse">Loading Dashboard...</p>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95">
          <VortexLoader />
          <p className="absolute top-1/3 text-lg font-semibold text-foreground animate-pulse">
            {loadingMessage}
          </p>
        </div>
      )}
      
      {showMenuTutorial && !showVortexLoader && (
        <div className="fixed inset-0 z-[60] pointer-events-none animate-in fade-in duration-500">
          <div className="absolute top-20 left-4 flex items-center gap-4 animate-in slide-in-from-left-8 duration-700">
            <div className="relative">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                className="animate-bounce-arrow"
              >
                <path
                  d="M10 40 L50 40 M50 40 L40 30 M50 40 L40 50"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary drop-shadow-glow"
                  fill="none"
                />
              </svg>
            </div>
            <div className="pointer-events-auto glass-strong border border-primary/50 rounded-lg p-6 shadow-2xl max-w-xs animate-bounce-slow">
              <p className="text-lg font-semibold text-primary mb-2">👋 Welcome!</p>
              <p className="text-sm text-foreground">
                Click the menu button to explore all features
              </p>
            </div>
          </div>
        </div>
      )}
      
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-80 glass-strong border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <SecurityXLogo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDrawerOpen(false)}
            className="hover:bg-destructive/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-primary/10 hover:scale-105 transition-all"
            onClick={() => navigateTo('vulnerabilities')}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Vulnerabilities</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-primary/10 hover:scale-105 transition-all"
            onClick={() => navigateTo('alerts')}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Security Alerts</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-primary/10 hover:scale-105 transition-all"
            onClick={() => navigateTo('api-keys')}
          >
            <Lock className="w-5 h-5" />
            <span className="font-medium">API Keys</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-primary/10 hover:scale-105 transition-all"
            onClick={() => navigateTo('integrations')}
          >
            <Shield className="w-5 h-5" />
            <span className="font-medium">Integrations</span>
          </Button>

          <div className="border-t border-border my-4" />

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-primary/10 hover:scale-105 transition-all"
            onClick={() => navigateTo('activity')}
          >
            <Activity className="w-5 h-5" />
            <span className="font-medium">Activity Logs</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-primary/10 hover:scale-105 transition-all"
            onClick={() => navigateTo('analytics')}
          >
            <BarChart className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-primary/10 hover:scale-105 transition-all"
            onClick={() => navigateTo('reports')}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Reports</span>
          </Button>

          <div className="border-t border-border my-4" />

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-primary/10 hover:scale-105 transition-all"
            onClick={() => navigateTo('settings')}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-destructive/10 text-destructive hover:text-destructive hover:scale-105 transition-all"
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/auth/sign-in'
            }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </nav>
      </div>
      
      <header className="glass-strong border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110"
                onClick={handleMenuClick}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <SecurityXLogo />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`transition-colors relative ${
                    unreadCount > 0 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-gray-500'
                  }`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <>
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-semibold animate-in zoom-in duration-300">
                        {unreadCount}
                      </span>
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping" />
                    </>
                  )}
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 glass-strong border border-border rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={markAllAsRead}
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-muted-foreground text-sm">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors ${
                              !notif.read ? 'bg-primary/5' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notif.id)}
                          >
                            <p className="text-sm text-foreground mb-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notif.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" data-section="dashboard">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Security Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor vulnerabilities, manage alerts, and protect your infrastructure
          </p>
        </div>

        
        {activeSection === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="glass border-green-500/50 bg-green-500/10 p-6 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-2xl">👋</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-500 mb-2">
                    Hello {userName}!
                  </h3>
                  <p className="text-green-100/90 mb-3">
                    Welcome to your SecurityX dashboard. Click the menu button in the top left to explore vulnerabilities, security alerts, integrations, and more. Get started by configuring your security monitoring and protection systems.
                  </p>
                  <Button 
                    className="btn-shiny bg-green-600 hover:bg-green-700 text-white border-0"
                    onClick={scrollToIntegrations}
                  >
                    Configure Integrations <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <SecurityScore />
              <ActivityTimeline />
            </div>
            
            <Card className="glass border-border p-12">
              <div className="text-center space-y-6">
                <img 
                  src="https://github.githubassets.com/assets/mona-loading-dark-7701a7b97370.gif" 
                  alt="Loading" 
                  className="w-32 h-32 mx-auto"
                />
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-foreground">
                    No data right now
                  </h3>
                  <p className="text-muted-foreground">
                    Start by configuring your security scans and monitoring targets
                  </p>
                </div>
                <Button 
                  className="btn-shiny text-primary-foreground border-0"
                  onClick={scrollToIntegrations}
                >
                  Get Started
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'vulnerabilities' && (
          <div className="animate-in fade-in duration-500">
            <Card className="glass border-border p-12">
              <div className="text-center space-y-6">
                <img 
                  src="https://github.githubassets.com/assets/mona-loading-dark-7701a7b97370.gif" 
                  alt="Loading" 
                  className="w-32 h-32 mx-auto"
                />
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-foreground">
                    No vulnerabilities detected
                  </h3>
                  <p className="text-muted-foreground">
                    Configure your security scanner to start detecting vulnerabilities
                  </p>
                </div>
                <Button 
                  className="btn-shiny text-primary-foreground border-0"
                  onClick={scrollToIntegrations}
                >
                  Get Started
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'alerts' && (
          <div className="animate-in fade-in duration-500">
            <Card className="glass border-border p-12">
              <div className="text-center space-y-6">
                <img 
                  src="https://github.githubassets.com/assets/mona-loading-dark-7701a7b97370.gif" 
                  alt="Octocat" 
                  className="w-32 h-32 mx-auto"
                />
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-foreground">
                    No data right now
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Configure alert rules to start monitoring security events
                  </p>
                  <Button 
                    className="btn-shiny text-primary-foreground border-0"
                    onClick={scrollToIntegrations}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'api-keys' && (
          <div className="animate-in fade-in duration-500">
            <Card className="glass border-border p-6">
              <h3 className="text-2xl font-semibold mb-2">API Credentials</h3>
              <p className="text-muted-foreground mb-6">
                Manage your API keys and proxy credentials for SecurityX integrations
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold">API Key</h4>
                  </div>
                  <Card className="glass border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold">Your API Key</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setShowApiId(!showApiId)}
                        >
                          {showApiId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(apiId, 'api')}
                        >
                          {copiedApi ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <code className="text-xs font-mono bg-secondary/50 px-3 py-2 rounded block break-all">
                      {showApiId ? apiId : '••••••••••••••••'}
                    </code>
                    <p className="text-xs text-muted-foreground mt-3">
                      Use this key to authenticate API requests to SecurityX services.
                    </p>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold">Proxy ID</h4>
                  </div>
                  <Card className="glass border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold">Your Proxy ID</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setShowProxyId(!showProxyId)}
                        >
                          {showProxyId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(proxyId, 'proxy')}
                        >
                          {copiedProxy ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <code className="text-xs font-mono bg-secondary/50 px-3 py-2 rounded block break-all">
                      {showProxyId ? proxyId : '••••••••••••••••'}
                    </code>
                    <p className="text-xs text-muted-foreground mt-3">
                      Use this ID for proxy connections and network security monitoring.
                    </p>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'integrations' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="glass border-border p-6">
              <h3 className="text-2xl font-semibold mb-2">Available Integrations</h3>
              <p className="text-muted-foreground mb-6">
                Connect your security tools and services to SecurityX
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {integrations.map((integration, index) => (
                  <Card 
                    key={integration.name}
                    className={`glass border-border p-6 ${
                      integration.available 
                        ? 'card-lift' 
                        : 'opacity-50 relative overflow-hidden'
                    }`}
                  >
                    {!integration.available && (
                      <div 
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 group"
                        title="In Production"
                      >
                        <div className="text-center">
                          <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                          <p className="text-sm font-semibold">In Production</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{integration.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          {integration.name}
                          {integration.connected && (
                            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                              Connected
                            </span>
                          )}
                        </h4>
                        
                        {integration.available && !integration.connected && (
                          <div className="space-y-3">
                            {expandedIntegration === index ? (
                              <div className="space-y-3">
                                {integration.fields.map((field) => (
                                  <div key={field.name}>
                                    <Label className="text-xs mb-1 block">
                                      {field.label} {field.required && <span className="text-destructive">*</span>}
                                    </Label>
                                    <Input
                                      type={field.type}
                                      placeholder={field.placeholder}
                                      className="bg-secondary/50 border-border text-sm h-8"
                                      value={integration.credentials[field.name] || ''}
                                      onChange={(e) => handleCredentialChange(index, field.name, e.target.value)}
                                    />
                                  </div>
                                ))}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="flex-1 btn-shiny text-primary-foreground border-0"
                                    onClick={() => handleIntegrationConnect(index)}
                                    disabled={!integration.fields
                                      .filter(f => f.required)
                                      .every(f => integration.credentials[f.name]?.trim())}
                                  >
                                    Connect
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="hover:scale-105 transition-all"
                                    onClick={() => setExpandedIntegration(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full btn-shiny text-primary-foreground border-0"
                                onClick={() => setExpandedIntegration(index)}
                              >
                                Configure
                              </Button>
                            )}
                          </div>
                        )}
                        
                        {integration.connected && (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Status: Active
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                const updated = [...integrations]
                                updated[index].connected = false
                                updated[index].credentials = {}
                                setIntegrations(updated)
                              }}
                            >
                              Disconnect
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="glass border-border p-6">
              <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Account Settings
              </h3>
              <p className="text-muted-foreground mb-6">
                Update your account information and preferences
              </p>
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email Address *
                  </Label>
                  <Input 
                    type="email" 
                    placeholder="Enter your email address"
                    value={settingsForm.email}
                    onChange={(e) => handleSettingsChange('email', e.target.value)}
                    className={`bg-secondary/50 border-border ${settingsErrors.email ? 'border-destructive' : ''}`}
                  />
                  {settingsErrors.email && (
                    <p className="text-xs text-destructive mt-1">{settingsErrors.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll send security alerts and updates to this email
                  </p>
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-primary" />
                    Company Name
                  </Label>
                  <Input 
                    placeholder="Enter your company name (optional)"
                    value={settingsForm.company}
                    onChange={(e) => handleSettingsChange('company', e.target.value)}
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <Button 
                  className="btn-shiny text-primary-foreground border-0"
                  onClick={handleSaveSettings}
                  disabled={!settingsForm.email || !!settingsErrors.email}
                >
                  Save Changes
                </Button>
              </div>
            </Card>

            <Card className="glass border-border p-6">
              <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                Security Settings
              </h3>
              <p className="text-muted-foreground mb-6">
                Update your password to keep your account secure
              </p>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Current Password *</Label>
                  <Input 
                    type="password" 
                    placeholder="Enter your current password"
                    value={settingsForm.currentPassword}
                    onChange={(e) => handleSettingsChange('currentPassword', e.target.value)}
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">New Password *</Label>
                  <Input 
                    type="password" 
                    placeholder="Enter a new password (min. 8 characters)"
                    value={settingsForm.newPassword}
                    onChange={(e) => handleSettingsChange('newPassword', e.target.value)}
                    className={`bg-secondary/50 border-border ${settingsErrors.newPassword ? 'border-destructive' : ''}`}
                  />
                  {settingsErrors.newPassword && (
                    <p className="text-xs text-destructive mt-1">{settingsErrors.newPassword}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-2 block">Confirm New Password *</Label>
                  <Input 
                    type="password" 
                    placeholder="Confirm your new password"
                    value={settingsForm.confirmPassword}
                    onChange={(e) => handleSettingsChange('confirmPassword', e.target.value)}
                    className={`bg-secondary/50 border-border ${settingsErrors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                  {settingsErrors.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">{settingsErrors.confirmPassword}</p>
                  )}
                </div>
                <Button 
                  className="btn-shiny text-primary-foreground border-0"
                  onClick={handleUpdatePassword}
                  disabled={!settingsForm.currentPassword || !settingsForm.newPassword || !settingsForm.confirmPassword}
                >
                  Update Password
                </Button>
              </div>
            </Card>

            <Card className="glass border-border p-6">
              <h3 className="text-2xl font-semibold mb-2 text-destructive flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Danger Zone
              </h3>
              <p className="text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">
                Delete Account
              </Button>
            </Card>
          </div>
        )}

        {(activeSection === 'activity' || activeSection === 'analytics' || activeSection === 'reports') && (
          <div className="animate-in fade-in duration-500">
            <Card className="glass border-border p-12">
              <div className="text-center space-y-6">
                <img 
                  src="https://github.githubassets.com/assets/mona-loading-dark-7701a7b97370.gif" 
                  alt="Coming Soon" 
                  className="w-32 h-32 mx-auto"
                />
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-foreground capitalize">
                    {activeSection} - Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    This feature is currently in development
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      <AIChatWidget isLandingPage={false} />
    </div>
  )
}
