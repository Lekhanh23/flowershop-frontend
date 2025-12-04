// src/app/api/orders/[id]/status/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALLOWED = ['pending', 'shipped', 'delivered'] as const;

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  await prisma.order.update({
    where: { id: Number(params.id) },
    data: { status },
  });
  return NextResponse.json({ ok: true });
}
