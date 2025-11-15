'use client'

import { Activity, Shield, AlertTriangle, CheckCircle, Link } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'

interface TimelineEvent {
  id: string
  type: 'scan' | 'alert' | 'integration' | 'success'
  title: string
  description: string
  timestamp: Date
}

export function ActivityTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      type: 'scan',
      title: 'Vulnerability Scan Completed',
      description: 'Found 3 vulnerabilities requiring attention',
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: '2',
      type: 'integration',
      title: 'Kubernetes Connected',
      description: 'Successfully integrated with cluster prod-01',
      timestamp: new Date(Date.now() - 14400000)
    },
    {
      id: '3',
      type: 'success',
      title: 'Security Patch Applied',
      description: 'Critical XSS vulnerability has been fixed',
      timestamp: new Date(Date.now() - 21600000)
    },
    {
      id: '4',
      type: 'alert',
      title: 'Unusual Activity Detected',
      description: 'Multiple failed login attempts from IP 192.168.1.1',
      timestamp: new Date(Date.now() - 28800000)
    },
  ])
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return <Shield className="w-4 h-4" />
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />
      case 'integration':
        return <Link className="w-4 h-4" />
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }
  
  const getColor = (type: string) => {
    switch (type) {
      case 'scan':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      case 'alert':
        return 'bg-red-500/20 text-red-500 border-red-500/30'
      case 'integration':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30'
      case 'success':
        return 'bg-green-500/20 text-green-500 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
    }
  }
  
  const formatTime = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / 3600000)
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }
  
  return (
    <Card className="glass border-border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {events.map((event, index) => (
          <div 
            key={event.id}
            className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${getColor(event.type)}`}>
              {getIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{event.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(event.timestamp)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
