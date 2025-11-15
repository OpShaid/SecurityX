'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export function ProfileDropdown() {
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: profileData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

          if (!profileData && !error) {
            const defaultProfile: UserProfile = {
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || 'User',
              avatar_url: null
            }
            setProfile(defaultProfile)
          } else if (profileData) {
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error('[v0] Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
    
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
          setProfile(payload.new as UserProfile)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSettings = () => {
    setIsOpen(false)
    const settingsTab = document.querySelector('[value="settings"]') as HTMLElement
    settingsTab?.click()
  }

  if (loading || !profile) {
    return (
      <div className="w-10 h-10 rounded-full bg-secondary/50 animate-pulse" />
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url || "/placeholder.svg"}
            alt={profile.full_name || 'User'}
            className="w-10 h-10 rounded-full object-cover border-2 border-border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-border flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-64 glass-strong border border-border rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.full_name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {profile.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-secondary/50"
                onClick={handleSettings}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-destructive/10 text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
