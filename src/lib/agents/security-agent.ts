import type { Agent, AgentFinding } from "./types";

const CERT_EXPIRY_CRITICAL_DAYS = 7;
const CERT_EXPIRY_WARNING_DAYS = 30;

export class SecurityAgent implements Agent {
  name = "Security Agent";
  description = "Scans for security vulnerabilities, expired certificates, and misconfigurations";

  async analyze(context: Record<string, unknown>): Promise<AgentFinding[]> {
    const findings: AgentFinding[] = [];

    // Analyze certificates
    const certificates = context.certificates as Array<{
      domain: string;
      daysLeft: number;
      autoRenew: boolean;
      issuer: string;
    }> | undefined;

    if (certificates) {
      for (const cert of certificates) {
        if (cert.daysLeft <= 0) {
          findings.push({
            severity: "critical",
            title: `Certificate expired: ${cert.domain}`,
            description: `The SSL certificate for ${cert.domain} has expired. Services using this certificate will show security warnings.`,
            recommendation: "Immediately renew the certificate. If using Let's Encrypt, check ACME client configuration.",
          });
        } else if (cert.daysLeft <= CERT_EXPIRY_CRITICAL_DAYS) {
          findings.push({
            severity: "critical",
            title: `Certificate expiring in ${cert.daysLeft} days: ${cert.domain}`,
            description: `The certificate for ${cert.domain} (issued by ${cert.issuer}) expires very soon.`,
            recommendation: cert.autoRenew
              ? "Auto-renewal is enabled but may be failing. Check ACME logs and DNS validation."
              : "Enable auto-renewal or manually renew the certificate immediately.",
          });
        } else if (cert.daysLeft <= CERT_EXPIRY_WARNING_DAYS) {
          findings.push({
            severity: "warning",
            title: `Certificate expiring in ${cert.daysLeft} days: ${cert.domain}`,
            description: `The certificate for ${cert.domain} will expire within ${cert.daysLeft} days.`,
            recommendation: cert.autoRenew
              ? "Auto-renewal is enabled. Verify the renewal process is working correctly."
              : "Consider enabling auto-renewal to prevent expiration.",
          });
        }
      }

      // Check for self-signed certificates on public-facing domains
      const selfSignedPublic = certificates.filter(
        (c) => c.issuer === "Self-signed" && !c.domain.endsWith(".local")
      );
      if (selfSignedPublic.length > 0) {
        findings.push({
          severity: "warning",
          title: `Self-signed certificate(s) on public domains`,
          description: `Self-signed certificates found on: ${selfSignedPublic.map((c) => c.domain).join(", ")}.`,
          recommendation: "Replace self-signed certificates with trusted CA certificates (e.g., Let's Encrypt) for public-facing services.",
        });
      }
    }

    // Analyze firewall rules
    const firewallRules = context.firewallRules as Array<{
      action: string;
      source: string;
      destination: string;
      port: string;
      protocol: string;
      description: string;
    }> | undefined;

    if (firewallRules) {
      // Check for overly permissive rules
      const permissiveRules = firewallRules.filter(
        (r) =>
          r.action === "pass" &&
          r.source === "any" &&
          r.destination === "any" &&
          r.port === "*"
      );

      if (permissiveRules.length > 0) {
        findings.push({
          severity: "critical",
          title: `${permissiveRules.length} overly permissive firewall rule(s)`,
          description: "Rules allowing all traffic from any source to any destination were detected.",
          recommendation: "Restrict firewall rules to specific sources, destinations, and ports following the principle of least privilege.",
        });
      }

      // Check for unrestricted network segments
      const unrestrictedSegments = firewallRules.filter(
        (r) => r.action === "pass" && r.port === "*" && r.protocol === "TCP"
      );

      if (unrestrictedSegments.length > 0) {
        findings.push({
          severity: "info",
          title: `${unrestrictedSegments.length} rule(s) with unrestricted port access`,
          description: `Rules granting full TCP port access: ${unrestrictedSegments.map((r) => r.description).join("; ")}.`,
          recommendation: "Review whether full port access is necessary. Consider restricting to specific required ports.",
        });
      }
    }

    // Analyze network for open ports / exposed services
    const interfaces = context.interfaces as Array<{
      name: string;
      status: string;
      ip: string;
    }> | undefined;

    if (interfaces) {
      const wanInterface = interfaces.find((i) => i.name === "WAN");
      if (wanInterface && wanInterface.status === "online") {
        findings.push({
          severity: "info",
          title: "WAN interface exposed",
          description: `WAN interface is online with IP ${wanInterface.ip}. Ensure only intended services are publicly accessible.`,
          recommendation: "Regularly audit publicly exposed ports using external scanning tools like Shodan or nmap.",
        });
      }
    }

    // Analyze connections for default credentials risk
    const connections = context.connections as Array<{
      name: string;
      type: string;
      host: string;
    }> | undefined;

    if (connections) {
      findings.push({
        severity: "info",
        title: "Credential audit recommended",
        description: `${connections.length} infrastructure connection(s) configured. Ensure none use default credentials.`,
        recommendation: "Audit all service accounts. Use API tokens instead of passwords where possible. Enable 2FA on all management interfaces.",
      });
    }

    // Check for missing VLAN isolation
    const vlans = context.vlans as Array<{
      name: string;
      devices: number;
    }> | undefined;

    if (vlans) {
      const iotVlan = vlans.find(
        (v) => v.name.toLowerCase().includes("iot")
      );
      if (iotVlan && iotVlan.devices > 15) {
        findings.push({
          severity: "warning",
          title: `IoT VLAN has ${iotVlan.devices} devices`,
          description: "A large number of IoT devices increases the attack surface. Some devices may have known vulnerabilities.",
          recommendation: "Consider segmenting IoT devices further by trust level. Block IoT internet access where not required.",
        });
      }
    }

    return findings;
  }
}
