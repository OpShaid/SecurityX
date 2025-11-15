'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Shield, Github, Mail, Send, CheckCircle, Zap, Users, BarChart3, LinkIcon, Activity } from 'lucide-react'
import { SecurityXLogo } from '@/components/securityx-logo'
import { AIChatWidget } from '@/components/ai-chat-widget'
import { TypingAnimation } from '@/components/typing-animation'
import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import Link from 'next/link'
import { ScrollFadeIn } from '@/components/scroll-fade-in'

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    emailjs.init('YOUR_PUBLIC_KEY')
    
    setTimeout(() => setMounted(true), 100)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      await emailjs.send(
        'service_5oxew2h',
        'service_5oxew2h',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'shaidt137@gmail.com',
        }
      )
      setSent(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 5000)
    } catch (error) {
      console.error('Failed to send email:', error)
    } finally {
      setSending(false)
    }
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="banner-bg">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/583125822_870807045522351_6259034097697249207_n-qcfPCgG8HXy2BWeTDBXiSbbAgDk7GP.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <header className={`relative border-b border-border sticky top-0 z-50 transition-all duration-1000 ease-out overflow-hidden ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}>
        <div className="absolute inset-0">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/582035166_1173048224768242_7198064604953036112_n-KeHjDzhNAJlNMfnC94pbToIu9FXGgE.jpg"
            alt="SecurityX"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>
        
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-center md:justify-end">
            <nav className="flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('features')} 
                className={`text-white/80 hover:text-white transition-all duration-700 delay-300 ease-out font-medium ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
                }`}
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className={`text-white/80 hover:text-white transition-all duration-700 delay-400 ease-out font-medium ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
                }`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('team')} 
                className={`text-white/80 hover:text-white transition-all duration-700 delay-500 ease-out font-medium ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
                }`}
              >
                Team
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className={`text-white/80 hover:text-white transition-all duration-700 delay-600 ease-out font-medium ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
                }`}
              >
                Contact
              </button>
              <Link href="/auth/sign-up">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`btn-shiny border-0 text-white hover:text-white transition-all duration-700 delay-700 ease-out ${
                    mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                  }`}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button 
                  size="sm" 
                  className={`btn-shiny border-0 transition-all duration-700 delay-800 ease-out ${
                    mounted ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-6 scale-90'
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://i.pinimg.com/originals/9a/9f/d3/9a9fd3c6b2e3f0d9e8e8e8e8e8e8e8e8.gif" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <ScrollFadeIn delay={50}>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                <TypingAnimation 
                  words={['Security', 'Protection', 'Defense', 'Monitoring', 'Scanning']}
                  className="text-primary"
                />
                <br />
                <span className="text-foreground">Platform</span>
              </h1>
            </ScrollFadeIn>
            
            <ScrollFadeIn delay={100}>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Protect your digital assets with real-time vulnerability scanning, intelligent alert management, and seamless integrations.
              </p>
            </ScrollFadeIn>
            
            <ScrollFadeIn delay={150}>
              <div className="flex gap-4 justify-center pt-4">
                <Link href="/auth/sign-up">
                  <Button 
                    size="lg" 
                    className="btn-shiny text-primary-foreground text-lg px-8 py-6 border-0"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  className="btn-shiny border-0 text-lg px-8 py-6"
                  onClick={() => scrollToSection('about')}
                >
                  Learn More
                </Button>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      <section 
        id="features" 
        className={`py-24 bg-card/50 transition-all duration-1000 delay-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <ScrollFadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Security Features</h2>
            </ScrollFadeIn>
            <ScrollFadeIn delay={150}>
              <p className="text-muted-foreground text-lg md:text-xl">
                Comprehensive security tools for modern threats
              </p>
            </ScrollFadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollFadeIn delay={200}>
              <Card className="glass border-border p-8 h-full card-lift">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png"
                  alt="Security Shield"
                  className="w-16 h-16 mb-6"
                />
                <h3 className="text-2xl font-semibold mb-4">Vulnerability Scanner</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Automated scanning for website vulnerabilities, security flaws, and potential threats.
                </p>
              </Card>
            </ScrollFadeIn>

            <ScrollFadeIn delay={350}>
              <Card className="glass border-border p-8 h-full card-lift">
                <BarChart3 className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Analytics Dashboard</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track security metrics, compliance scores, and threat trends with visual analytics.
                </p>
              </Card>
            </ScrollFadeIn>

            <ScrollFadeIn delay={500}>
              <Card className="glass border-border p-8 h-full card-lift">
                <LinkIcon className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Connect Services</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Integrate with Kubernetes, Grafana, Prometheus, and more for seamless workflow automation.
                </p>
              </Card>
            </ScrollFadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <ScrollFadeIn delay={650}>
              <Card className="glass border-border p-8 h-full card-lift">
                <Activity className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Activity Monitoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor user activity, API calls, and system events in real-time for complete visibility.
                </p>
              </Card>
            </ScrollFadeIn>

            <ScrollFadeIn delay={800}>
              <Card className="glass border-border p-8 h-full card-lift">
                <Shield className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Threat Detection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-powered threat detection identifies suspicious patterns and security anomalies.
                </p>
              </Card>
            </ScrollFadeIn>

            <ScrollFadeIn delay={950}>
              <Card className="glass border-border p-8 h-full card-lift">
                <CheckCircle className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Compliance Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Maintain GDPR, SOC2, and OWASP compliance with automated security audits.
                </p>
              </Card>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      <section id="stats" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <ScrollFadeIn delay={150}>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-muted-foreground">Uptime Guarantee</p>
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Security Monitoring</p>
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={450}>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">10k+</div>
                <p className="text-muted-foreground">Vulnerabilities Detected</p>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollFadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
                About SecurityX
              </h2>
            </ScrollFadeIn>
            
            <Card className="glass border-border p-12 space-y-4">
              <ScrollFadeIn delay={200}>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  SecurityX is a cutting-edge security platform designed to help organizations identify and mitigate digital threats before they become problems.
                </p>
              </ScrollFadeIn>
              
              <ScrollFadeIn delay={400}>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our advanced vulnerability scanning engine continuously monitors your infrastructure, while our intelligent alert system keeps your team informed of critical security events.
                </p>
              </ScrollFadeIn>
              
              <ScrollFadeIn delay={600}>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  With seamless integrations and AI-powered insights, SecurityX makes enterprise-grade security accessible to teams of all sizes.
                </p>
              </ScrollFadeIn>
              
              <ScrollFadeIn delay={800}>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  From SQL injection detection to real-time threat analysis, we've got you covered.
                </p>
              </ScrollFadeIn>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <ScrollFadeIn delay={1000}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Real-time Scanning</h4>
                      <p className="text-sm text-muted-foreground">Continuous monitoring of your applications</p>
                    </div>
                  </div>
                </ScrollFadeIn>
                
                <ScrollFadeIn delay={1150}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">AI-Powered Analysis</h4>
                      <p className="text-sm text-muted-foreground">Smart threat detection and recommendations</p>
                    </div>
                  </div>
                </ScrollFadeIn>
                
                <ScrollFadeIn delay={1300}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Team Collaboration</h4>
                      <p className="text-sm text-muted-foreground">Integrate with your favorite tools</p>
                    </div>
                  </div>
                </ScrollFadeIn>
                
                <ScrollFadeIn delay={1450}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Compliance Ready</h4>
                      <p className="text-sm text-muted-foreground">GDPR, SOC2, and OWASP compliant</p>
                    </div>
                  </div>
                </ScrollFadeIn>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="team" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <ScrollFadeIn>
              <Users className="w-16 h-16 text-primary mx-auto mb-4" />
            </ScrollFadeIn>
            <ScrollFadeIn delay={150}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet The Team</h2>
            </ScrollFadeIn>
            <ScrollFadeIn delay={300}>
              <p className="text-muted-foreground text-lg md:text-xl">
                Driven by passion for security and innovation
              </p>
            </ScrollFadeIn>
          </div>

          <div className="max-w-2xl mx-auto">
            <ScrollFadeIn delay={450}>
              <Card className="glass border-border p-12 card-lift hover:shadow-2xl transition-all duration-500">
                <div className="text-center">
                  <img 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/575504067_1325418312413272_4135354838768288616_n-66Jga0dseT1bGjjWvc3yM8u7LUJYGq.jpg"
                    alt="Shaid T"
                    className="w-32 h-32 rounded-full mx-auto mb-6 ring-4 ring-primary/20 object-cover"
                  />
                  <h3 className="text-3xl font-bold mb-2">Shaid T</h3>
                  <p className="text-primary text-lg mb-6 font-semibold">Developer & Founder</p>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                    Passionate about building secure, scalable solutions that protect digital infrastructure. Specializing in full-stack development, AI integration, and cybersecurity.
                  </p>
                  <div className="flex gap-6 justify-center">
                    <a 
                      href="https://github.com/OpShaid" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 px-6 py-3 rounded-lg hover:bg-secondary/50"
                    >
                      <Github className="w-6 h-6" />
                      <span className="font-medium">OpShaid</span>
                    </a>
                    <a 
                      href="mailto:shaidt137@gmail.com"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 px-6 py-3 rounded-lg hover:bg-secondary/50"
                    >
                      <Mail className="w-6 h-6" />
                      <span className="font-medium">Email</span>
                    </a>
                  </div>
                </div>
              </Card>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <ScrollFadeIn>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
              </ScrollFadeIn>
              <ScrollFadeIn delay={150}>
                <p className="text-muted-foreground text-lg md:text-xl">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </ScrollFadeIn>
            </div>

            <ScrollFadeIn delay={300}>
              <Card className="glass border-border p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you're thinking..."
                      rows={6}
                      className="bg-background border-border"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full btn-shiny text-primary-foreground text-lg py-6 border-0"
                    disabled={sending}
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : sent ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SecurityXLogo />
            </div>
            <p className="text-muted-foreground">© 2025 SecurityX. All rights reserved.</p>
            <div className="flex gap-6">
              <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('team')} className="text-muted-foreground hover:text-foreground transition-colors">
                Team
              </button>
            </div>
          </div>
        </div>
      </footer>

      <AIChatWidget isLandingPage={true} />
    </div>
  )
}
