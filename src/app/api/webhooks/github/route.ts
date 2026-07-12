import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHmac, timingSafeEqual } from 'crypto';
import { addWebhookJob } from '@/lib/queue/webhookQueue';

function parseGithubSignature(signatureHeader: string | null): string | null {
  if (!signatureHeader) return null;
  const prefix = 'sha256=';
  return signatureHeader.startsWith(prefix) ? signatureHeader.slice(prefix.length) : null;
}

async function verifyGitHubWebhook(req: NextRequest): Promise<any> {
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('GITHUB_WEBHOOK_SECRET is not set');
  }

  const signatureHex = parseGithubSignature(req.headers.get('x-hub-signature-256'));
  if (!signatureHex) {
    throw new Error('Missing or invalid x-hub-signature-256 header');
  }

  const payloadText = await req.text();
  const digest = createHmac('sha256', webhookSecret).update(payloadText).digest('hex');

  const sigBuf = Buffer.from(signatureHex, 'hex');
  const digBuf = Buffer.from(digest, 'hex');

  if (sigBuf.length !== digBuf.length || !timingSafeEqual(sigBuf, digBuf)) {
    throw new Error('Invalid GitHub webhook signature');
  }

  return JSON.parse(payloadText);
}

export async function POST(req: NextRequest) {
  try {
    const rawPayload = await verifyGitHubWebhook(req);

    // Strict input validation schema
    const repoSchema = z.object({
      id: z.union([z.number(), z.string()]),
      full_name: z.string(),
      name: z.string().optional(),
      owner: z.object({
        login: z.string()
      }).passthrough().optional()
    }).passthrough();

    const payloadSchema = z.object({
      action: z.string().optional(),
      pull_request: z.object({
        id: z.union([z.number(), z.string()]),
        number: z.number(),
        title: z.string().optional(),
        state: z.string().optional(),
        merged: z.boolean().optional(),
        merged_at: z.string().nullable().optional(),
        head: z.object({
          sha: z.string()
        }).passthrough().optional(),
        user: z.object({
          login: z.string(),
          avatar_url: z.string().optional()
        }).passthrough().optional()
      }).passthrough().optional(),
      repository: repoSchema.optional(),
      installation: z.object({
        id: z.union([z.number(), z.string()])
      }).passthrough().optional(),
      repositories: z.array(repoSchema).optional(),
      repositories_added: z.array(repoSchema).optional(),
      sender: z.object({
        id: z.union([z.number(), z.string()])
      }).passthrough().optional()
    }).passthrough();

    const parsed = payloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      console.error('Invalid webhook payload structure:', parsed.error.format());
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }
    const payload = parsed.data;

    const deliveryId = req.headers.get('x-github-delivery');
    const event = req.headers.get('x-github-event');

    await addWebhookJob({
      payload,
      deliveryId,
      event,
    });

    return NextResponse.json({ status: "queued" }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: error.message?.includes('signature') ? 401 : 500 });
  }
}