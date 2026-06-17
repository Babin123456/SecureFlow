import prisma from "@/lib/prisma";
import DashboardClient from "./dashboard-client";
import { MOCK_CHART_DATA } from "@/lib/mock-data"; // Temporary keep mock for charts if grouping by date is complex right now

export const dynamic = "force-dynamic"; // Ensures data is fetched freshly

export default async function OverviewPage() {
  // 1. Fetch High-level Stats
  const totalScans = await prisma.scanResult.count();
  const blockedPRs = await prisma.pullRequest.count({ where: { status: 'BLOCKED' } });
  const approvedPRs = await prisma.pullRequest.count({ where: { status: 'PASS' } });
  const secretsDetected = await prisma.finding.count({ where: { type: 'Secret' } });

  // 2. Fetch Recent Pull Requests with Repository Info
  const recentPRs = await prisma.pullRequest.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { repository: true }
  });

  // 3. Fetch Severity Distribution
  const critical = await prisma.finding.count({ where: { severity: 'CRITICAL' } });
  const high = await prisma.finding.count({ where: { severity: 'HIGH' } });
  const medium = await prisma.finding.count({ where: { severity: 'MEDIUM' } });
  const low = await prisma.finding.count({ where: { severity: 'LOW' } });

  const stats = { totalScans, blockedPRs, approvedPRs, secretsDetected };
  const distribution = { critical, high, medium, low };

  return (
    <DashboardClient 
      stats={stats} 
      prs={recentPRs} 
      distribution={distribution} 
      chartData={MOCK_CHART_DATA} 
    />
  );
}