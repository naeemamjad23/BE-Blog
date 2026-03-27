import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed 8 Cybersecurity Domains
  const domains = [
    { name: 'Application Security', slug: 'appsec', description: 'OWASP, secure coding, SAST/DAST, API security', icon: 'Shield', color: '#EF4444', sortOrder: 1 },
    { name: 'Network Security', slug: 'network-security', description: 'Firewalls, IDS/IPS, zero trust, VPN, segmentation', icon: 'Network', color: '#3B82F6', sortOrder: 2 },
    { name: 'Cloud Security', slug: 'cloud-security', description: 'AWS/Azure/GCP hardening, CSPM, container security', icon: 'Cloud', color: '#8B5CF6', sortOrder: 3 },
    { name: 'Threat Intelligence', slug: 'threat-intelligence', description: 'Threat hunting, IOCs, MITRE ATT&CK, malware analysis', icon: 'Search', color: '#F59E0B', sortOrder: 4 },
    { name: 'GRC', slug: 'grc', description: 'Governance, Risk & Compliance — ISO 27001, SOC 2, NIST, risk frameworks', icon: 'FileCheck', color: '#10B981', sortOrder: 5 },
    { name: 'Penetration Testing', slug: 'pentesting', description: 'Red team, recon, exploitation, reporting, CTFs', icon: 'Target', color: '#EC4899', sortOrder: 6 },
    { name: 'SOC & Incident Response', slug: 'soc-ir', description: 'SIEM, detection engineering, IR playbooks, forensics', icon: 'AlertTriangle', color: '#F97316', sortOrder: 7 },
    { name: 'Secure Development', slug: 'devsecops', description: 'CI/CD security, IaC scanning, SBOM, shift-left', icon: 'Code', color: '#06B6D4', sortOrder: 8 },
  ];

  for (const domain of domains) {
    await prisma.domain.upsert({
      where: { slug: domain.slug },
      update: domain,
      create: domain,
    });
  }
  console.log('Seeded 8 cybersecurity domains');

  // Seed admin user
  const passwordHash = await bcrypt.hash('SecureMango@Admin2024', 12);
  await prisma.adminUser.upsert({
    where: { email: 'admin@securemango.com' },
    update: {},
    create: {
      email: 'admin@securemango.com',
      passwordHash,
      name: 'SecureMango Admin',
      role: 'admin',
    },
  });
  console.log('Seeded admin user: admin@securemango.com');

  // Seed default author
  await prisma.author.upsert({
    where: { slug: 'securemango' },
    update: {},
    create: {
      name: 'SecureMango',
      slug: 'securemango',
      bio: 'Cybersecurity insights and tutorials from the SecureMango team.',
      twitter: 'securemango',
      linkedin: 'securemango',
      github: 'naeemamjad23',
    },
  });
  console.log('Seeded default author');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
