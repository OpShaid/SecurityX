export const maxDuration = 30

interface Message {
  id: string
  role: 'user' | 'assistant'
  parts: { type: 'text'; text: string }[]
}

// Smart security-focused response generator
function generateSecurityResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  // Kubernetes responses
  if (lowerMessage.includes('kubernetes') || lowerMessage.includes('k8s')) {
    return `Kubernetes Security Best Practices:

**Pod Security:**
• Use Pod Security Standards (Baseline/Restricted)
• Run containers as non-root users
• Enable read-only root filesystems
• Drop unnecessary Linux capabilities

**Network Policies:**
• Implement strict ingress/egress rules
• Use NetworkPolicies to segment traffic
• Enable service mesh (Istio, Linkerd) for mTLS

**RBAC & Access:**
• Follow principle of least privilege
• Use ServiceAccounts with minimal permissions
• Enable audit logging
• Rotate secrets regularly

**SecurityX Integration:**
Connect your Kubernetes cluster in Dashboard > Integrations to monitor security posture and detect misconfigurations.`
  }

  // Grafana/Prometheus monitoring
  if (lowerMessage.includes('grafana') || lowerMessage.includes('prometheus') || lowerMessage.includes('monitoring')) {
    return `Security Monitoring with Grafana & Prometheus:

**Key Metrics to Track:**
• Failed authentication attempts
• Unusual API request patterns
• Resource usage anomalies
• Certificate expiration dates

**Alert Configuration:**
\`\`\`yaml
- alert: HighFailedLogins
  expr: rate(failed_logins[5m]) > 10
  annotations:
    summary: "High failed login rate"
\`\`\`

**SecurityX Integration:**
Connect Grafana and Prometheus in Dashboard > Integrations to visualize security metrics and create custom dashboards for threat detection.`
  }

  // Docker security
  if (lowerMessage.includes('docker') || lowerMessage.includes('container')) {
    return `Docker Security Essentials:

**Image Security:**
• Scan images for vulnerabilities (Trivy, Clair)
• Use minimal base images (Alpine, Distroless)
• Multi-stage builds to reduce attack surface
• Sign images with Docker Content Trust

**Runtime Security:**
\`\`\`dockerfile
# Run as non-root user
USER 1000:1000

# Read-only filesystem
--read-only --tmpfs /tmp

# Drop capabilities
--cap-drop=ALL --cap-add=NET_BIND_SERVICE
\`\`\`

**Network Isolation:**
• Use custom bridge networks
• Implement firewall rules
• Enable AppArmor/SELinux profiles

SecurityX Docker integration (coming soon) will scan your containers automatically!`
  }

  // PostgreSQL/Database security
  if (lowerMessage.includes('postgresql') || lowerMessage.includes('postgres') || lowerMessage.includes('database')) {
    return `PostgreSQL Security Configuration:

**Access Control:**
\`\`\`
# pg_hba.conf
hostssl all all 0.0.0.0/0 scram-sha-256
\`\`\`

**Best Practices:**
• Enable SSL/TLS for all connections
• Use strong password hashing (scram-sha-256)
• Implement Row-Level Security (RLS)
• Regular vacuum and security updates
• Audit logging with pgAudit

**Privilege Management:**
• Create separate users per application
• Grant minimal required permissions
• Revoke PUBLIC schema access
• Use connection pooling (PgBouncer)

SecurityX can monitor your database connections and detect suspicious queries. Configure in Integrations tab!`
  }

  // Vulnerability scanning responses
  if (lowerMessage.includes('vulnerability') || lowerMessage.includes('scan')) {
    return `Based on my security analysis, I recommend:

1. **SQL Injection**: Use parameterized queries and prepared statements
2. **XSS Protection**: Implement Content Security Policy (CSP) headers
3. **CSRF**: Use anti-CSRF tokens for state-changing operations
4. **Authentication**: Implement rate limiting and multi-factor authentication

SecurityX can help you identify these vulnerabilities automatically. Would you like me to explain any specific vulnerability type?`
  }

  // Alert management responses
  if (lowerMessage.includes('alert') || lowerMessage.includes('notification')) {
    return `SecurityX Alert Management helps you:

• **Real-time Monitoring**: Get instant notifications for security events
• **Priority Levels**: Automatic severity classification (Critical, High, Medium, Low)
• **Smart Filtering**: Reduce alert fatigue with intelligent filtering
• **Slack Integration**: Send alerts directly to your team channels

You can configure alert rules in the Dashboard > Alerts section. What type of alerts would you like to set up?`
  }

  // Slack integration responses
  if (lowerMessage.includes('slack') || lowerMessage.includes('integration')) {
    return `Setting up Slack integration with SecurityX:

1. Go to **Dashboard > Integrations**
2. Click "Connect Slack" (currently in production)
3. Authorize SecurityX to access your workspace
4. Select channels for different alert types
5. Configure notification preferences

Once connected, you'll receive real-time security alerts, vulnerability reports, and system status updates. Need help with webhook configuration?`
  }

  // OWASP/Security best practices
  if (lowerMessage.includes('owasp') || lowerMessage.includes('best practice')) {
    return `OWASP Top 10 Security Best Practices:

1. **Broken Access Control**: Implement proper authorization
2. **Cryptographic Failures**: Use strong encryption (AES-256, RSA-2048)
3. **Injection Flaws**: Validate and sanitize all inputs
4. **Insecure Design**: Follow secure development lifecycle
5. **Security Misconfiguration**: Harden all configurations

SecurityX automatically checks for these issues. Want details on any specific category?`
  }

  // XSS specific
  if (lowerMessage.includes('xss') || lowerMessage.includes('cross-site')) {
    return `XSS (Cross-Site Scripting) Prevention:

**Input Validation:**
- Sanitize all user inputs
- Use allowlists, not blocklists
- Validate on both client and server

**Output Encoding:**
- HTML entity encode: &lt; &gt; &amp; " '
- Use context-aware encoding
- Implement CSP headers

**SecurityX Detection:**
We scan for reflected, stored, and DOM-based XSS vulnerabilities automatically. Run a scan to check your application.`
  }

  // SQL Injection
  if (lowerMessage.includes('sql') || lowerMessage.includes('injection')) {
    return `SQL Injection Prevention Strategies:

**Parameterized Queries:**
\`\`\`sql
-- BAD: "SELECT * FROM users WHERE id=" + userId
-- GOOD: Use prepared statements with parameters
\`\`\`

**Additional Protections:**
• Use ORM frameworks (Prisma, TypeORM)
• Implement least privilege database access
• Enable database query logging
• Regular security audits

SecurityX can scan your API endpoints for SQL injection vulnerabilities. Would you like to start a scan?`
  }

  // Authentication/Authorization
  if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('password')) {
    return `Secure Authentication Best Practices:

**Password Security:**
• Minimum 12 characters
• Use bcrypt/Argon2 for hashing
• Implement account lockout policies

**Session Management:**
• Use secure, HttpOnly cookies
• Implement CSRF protection
• Set appropriate session timeouts

**Multi-Factor Authentication:**
• TOTP-based (Google Authenticator)
• SMS/Email verification
• Hardware tokens for high-security

SecurityX monitors authentication attempts and detects brute force attacks. Enable MFA in Settings > Security.`
  }

  // API Security
  if (lowerMessage.includes('api') || lowerMessage.includes('endpoint')) {
    return `API Security Checklist:

**Authentication & Authorization:**
• JWT tokens with short expiration
• OAuth 2.0 / OpenID Connect
• API key rotation policies

**Rate Limiting:**
• Prevent DDoS attacks
• 100 requests/minute per IP
• Progressive delays for violations

**Input Validation:**
• Schema validation (Zod, Joi)
• Request size limits
• Content-Type enforcement

SecurityX can monitor your API endpoints for suspicious activity. Configure API security rules in the Dashboard.`
  }

  // HTTPS/TLS
  if (lowerMessage.includes('https') || lowerMessage.includes('tls') || lowerMessage.includes('ssl')) {
    return `HTTPS/TLS Security Configuration:

**Certificate Management:**
• Use TLS 1.3 (disable older versions)
• Let's Encrypt for free certificates
• Set up auto-renewal

**Security Headers:**
\`\`\`
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
\`\`\`

SecurityX checks your SSL/TLS configuration and alerts you to misconfigurations. Run a security audit now?`
  }

  // General security questions
  if (lowerMessage.includes('security') || lowerMessage.includes('protect')) {
    return `SecurityX provides comprehensive protection:

**Core Features:**
• Automated vulnerability scanning
• Real-time threat detection
• Security alert management
• Compliance monitoring (GDPR, SOC2)

**Integrations:**
• Slack notifications
• GitHub security alerts
• CI/CD pipeline integration
• SIEM system compatibility

Ask me about specific vulnerabilities, best practices, or how to configure SecurityX for your needs!`
  }

  // Help/Getting started
  if (lowerMessage.includes('help') || lowerMessage.includes('start') || lowerMessage.includes('how')) {
    return `Welcome to SecurityX AI! I can help you with:

🔒 **Vulnerability Analysis** - "How do I prevent SQL injection?"
🚨 **Alert Management** - "Set up critical alerts"
🔗 **Integrations** - "Connect Slack notifications"
📊 **Security Reports** - "Generate compliance report"
🛡️ **Best Practices** - "OWASP Top 10 recommendations"

Just ask me anything about web security, and I'll provide detailed guidance!`
  }

  // Default response
  return `I'm SecurityX AI, your security expert assistant. I can help you with:

• **Vulnerability Scanning**: Detect security flaws in your applications
• **Alert Management**: Configure and manage security notifications
• **Best Practices**: OWASP guidelines and secure coding standards
• **Threat Analysis**: Analyze potential security risks
• **Integration Setup**: Connect with Slack and other tools

What security topic would you like to discuss?`
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json()

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    const userText = lastMessage.parts.find((p) => p.type === 'text')?.text || ''

    // Generate response
    const responseText = generateSecurityResponse(userText)

    // Simulate streaming delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Return response in the expected format
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send the response as a data chunk
        const data = {
          type: 'text',
          text: responseText,
        }
        controller.enqueue(encoder.encode(`0:${JSON.stringify(data)}\n`))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    })
  } catch (error) {
    console.error('[v0] Chat error:', error)
    return new Response('Error processing chat', { status: 500 })
  }
}
