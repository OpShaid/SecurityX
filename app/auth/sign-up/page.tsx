'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SecurityXLogo } from '@/components/securityx-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { PasswordStrength } from '@/components/password-strength'
import { PageLoader } from '@/components/page-loader'
import Link from 'next/link'
import { Shield, Mail, Lock, User, CheckCircle, AlertCircle, Sparkles, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPageLoader, setShowPageLoader] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, avatar: 'File size must be less than 5MB' })
        return
      }
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
      setErrors({ ...errors, avatar: '' })
    }
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
    console.log('[v0] Sign up button clicked')
    if (!validateForm()) {
      console.log('[v0] Validation failed:', errors)
      return
    }

    setIsLoading(true)

    try {
      console.log('[v0] Starting signup process...')
      
      if (avatarFile) {
        const reader = new FileReader()
        reader.onloadend = () => {
          localStorage.setItem('pendingAvatar', reader.result as string)
          localStorage.setItem('pendingAvatarName', avatarFile.name)
        }
        reader.readAsDataURL(avatarFile)
      }
      
      localStorage.setItem('pendingProfileData', JSON.stringify({
        full_name: formData.name,
        email: formData.email,
      }))

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: 'https://v0-full-stack-ai-app-rho.vercel.app/auth/sign-in',
          data: {
            full_name: formData.name,
          }
        }
      })

      if (authError) {
        console.error('[v0] Auth error:', authError)
        throw authError
      }

      console.log('[v0] User created:', authData.user?.id)
      console.log('[v0] Signup successful - Please check your email for verification')
      
      setShowSuccess(true)
      setIsLoading(false)
    } catch (error) {
      console.error('[v0] Signup error:', error)
      setErrors({ ...errors, general: error instanceof Error ? error.message : 'An error occurred' })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('[v0] SignUpPage mounted')
    const timer = setTimeout(() => {
      console.log('[v0] Initial page loader complete')
      setShowPageLoader(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (showPageLoader) {
    return <PageLoader message="Rendering sign up..." />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(190,190,190,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(190,190,190,0.08),transparent_50%)]" />
      
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse [animation-duration:5s]" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse [animation-duration:7s] [animation-delay:1s]" />

      <div className="relative w-full max-w-lg">
        <div className="glass-strong rounded-2xl p-8 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-6">
            <SecurityXLogo />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Create Account
            </h1>
            <p className="text-muted-foreground text-lg">
              Join SecurityX and protect your digital assets
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setErrors({ ...errors, name: '' })
                }}
                required
                className={`bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:scale-[1.01] ${
                  errors.name ? 'border-destructive' : ''
                }`}
              />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setErrors({ ...errors, email: '' })
                }}
                required
                className={`bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:scale-[1.01] ${
                  errors.email ? 'border-destructive' : ''
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  setErrors({ ...errors, password: '' })
                }}
                required
                className={`bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:scale-[1.01] ${
                  errors.password ? 'border-destructive' : ''
                }`}
              />
              <PasswordStrength password={formData.password} />
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value })
                  setErrors({ ...errors, confirmPassword: '' })
                }}
                required
                className={`bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:scale-[1.01] ${
                  errors.confirmPassword ? 'border-destructive' : ''
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile Picture (Optional)
              </Label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <div className="relative">
                    <img 
                      src={avatarPreview || "/placeholder.svg"} 
                      alt="Avatar preview" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-border"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="bg-secondary/50 border-border text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Max size: 5MB. PNG, JPG, or GIF
                  </p>
                  {errors.avatar && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.avatar}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                  setErrors({ ...errors, terms: '' })
                }}
                required
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-relaxed"
              >
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:text-primary/80 font-semibold">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary/80 font-semibold">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.terms}
              </p>
            )}

            <Button
              type="submit"
              className="w-full btn-shiny text-primary-foreground font-semibold text-base py-6 border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating your account...
                </div>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Create Secure Account
                </>
              )}
            </Button>

            {errors.general && (
              <p className="text-sm text-destructive text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.general}
              </p>
            )}
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-2 border-border bg-secondary/30 hover:bg-secondary/50 text-foreground hover:scale-105 transition-all duration-300 h-12 hover:shadow-lg hover:border-primary/30"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="border-2 border-border bg-secondary/30 hover:bg-secondary/50 text-foreground hover:scale-105 transition-all duration-300 h-12 hover:shadow-lg hover:border-primary/30"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              GitHub
            </Button>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/sign-in"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="glass-strong border-border">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Mail className="w-16 h-16 text-primary" />
                <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center">Check Your Email!</DialogTitle>
            <DialogDescription className="text-center text-base">
              We've sent a verification link to <strong>{formData.email}</strong>. 
              Please click the link in the email to verify your account and complete the signup process.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Check your inbox</p>
                <p className="text-xs text-muted-foreground">Look for an email from SecurityX</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Click the verification link</p>
                <p className="text-xs text-muted-foreground">This confirms your email address</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Sign in to your account</p>
                <p className="text-xs text-muted-foreground">You'll be redirected to the login page</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/auth/sign-in')}
            className="w-full mt-4"
          >
            Go to Sign In
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
