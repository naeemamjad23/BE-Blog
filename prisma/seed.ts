import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed 9 Cybersecurity Domains (CISSP-aligned with sub-domains)
  const domains = [
    { name: 'Security & Risk Management', slug: 'security-risk-management', description: 'Risk management, governance, policies, compliance, audit, vendor risk, BCP/DR', icon: 'FileCheck', color: '#10B981', sortOrder: 1 },
    { name: 'Asset Security', slug: 'asset-security', description: 'Data classification, lifecycle management, encryption, DLP, privacy, database security, backup & recovery', icon: 'Database', color: '#84CC16', sortOrder: 2 },
    { name: 'Security Architecture & Engineering', slug: 'security-architecture', description: 'Secure design, threat modeling, cryptography, hardware security, zero trust architecture', icon: 'Building', color: '#0EA5E9', sortOrder: 3 },
    { name: 'Communication & Network Security', slug: 'network-security', description: 'Network architecture, segmentation, secure protocols, firewalls, IDS/IPS, wireless, IoT & OT/ICS security', icon: 'Network', color: '#3B82F6', sortOrder: 4 },
    { name: 'Identity & Access Management', slug: 'iam', description: 'Authentication, authorization, federation, PAM, identity lifecycle, zero trust identity', icon: 'Key', color: '#6366F1', sortOrder: 5 },
    { name: 'Security Assessment & Testing', slug: 'security-assessment', description: 'Vulnerability assessment, scanning, penetration testing, red teaming, security audits, bug bounty', icon: 'Target', color: '#EC4899', sortOrder: 6 },
    { name: 'Security Operations', slug: 'security-operations', description: 'SIEM/XDR, threat hunting, incident response, digital forensics, threat intelligence, SOAR', icon: 'AlertTriangle', color: '#F97316', sortOrder: 7 },
    { name: 'Software Development Security', slug: 'software-development-security', description: 'Secure SDLC, DevSecOps, application & API security, SAST/DAST/IAST, AI/ML & LLM security', icon: 'Code', color: '#EF4444', sortOrder: 8 },
    { name: 'Cloud & Platform Security', slug: 'cloud-platform-security', description: 'Cloud infrastructure, identity & misconfiguration, containers & Kubernetes, serverless, endpoint & device security, virtualization', icon: 'Cloud', color: '#8B5CF6', sortOrder: 9 },
  ];

  for (const domain of domains) {
    await prisma.domain.upsert({
      where: { slug: domain.slug },
      update: domain,
      create: domain,
    });
  }
  console.log('Seeded 9 cybersecurity domains');

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
