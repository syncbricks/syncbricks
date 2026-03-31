import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

function detectSSHKey(): { exists: boolean; path: string; publicKey?: string } {
  const keyPaths = [
    path.join(process.env.HOME || "/root", ".ssh", "id_ed25519"),
    path.join(process.env.HOME || "/root", ".ssh", "id_rsa"),
    path.join(process.env.HOME || "/root", ".ssh", "id_ecdsa"),
  ];

  for (const keyPath of keyPaths) {
    const pubPath = `${keyPath}.pub`;
    if (fs.existsSync(keyPath) && fs.existsSync(pubPath)) {
      const publicKey = fs.readFileSync(pubPath, "utf-8").trim();
      return { exists: true, path: keyPath, publicKey };
    }
  }

  return { exists: false, path: "" };
}

export async function GET() {
  const allConnections = await db.select().from(connections);
  const sshKey = detectSSHKey();

  return NextResponse.json({
    connections: allConnections,
    sshKey: {
      detected: sshKey.exists,
      path: sshKey.path,
      publicKey: sshKey.publicKey,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, type, host, port, username, password, apiToken, sslVerify } = body;

  if (!name || !type || !host) {
    return NextResponse.json(
      { error: "Name, type, and host are required" },
      { status: 400 }
    );
  }

  const result = await db.insert(connections).values({
    name,
    type,
    host,
    port: port || null,
    username: username || null,
    password: password || null,
    apiToken: apiToken || null,
    sslVerify: sslVerify ?? false,
    enabled: true,
  }).returning();

  return NextResponse.json({ success: true, connection: result[0] });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Connection ID is required" }, { status: 400 });
  }

  updates.updatedAt = new Date().toISOString();

  await db.update(connections).set(updates).where(eq(connections.id, id));
  const updated = await db.select().from(connections).where(eq(connections.id, id));

  return NextResponse.json({ success: true, connection: updated[0] });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Connection ID is required" }, { status: 400 });
  }

  await db.delete(connections).where(eq(connections.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
