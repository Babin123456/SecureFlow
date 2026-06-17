import prisma from "@/lib/prisma";
import FindingsClient from "./findings-client";

export const dynamic = "force-dynamic";

export default async function FindingsPage() {
  // 1. Fetch dynamic stats for the top cards
  const criticalSecrets = await prisma.finding.count({
    where: { type: 'Secret', severity: 'CRITICAL' }
  });
  
  const vulnerabilities = await prisma.finding.count({
    where: { type: 'Vulnerability' }
  });

  const misconfigs = await prisma.finding.count({
    where: { type: 'Misconfig' }
  });

  // 2. Fetch the actual findings, joining related Scan and PR context if necessary
  const findings = await prisma.finding.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50, // Prevent massive initial payloads
    include: {
      scanResult: {
        include: { pullRequest: true }
      }
    }
  });

  const stats = { criticalSecrets, vulnerabilities, misconfigs };

  return <FindingsClient findings={findings} stats={stats} />;
}