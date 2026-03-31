import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { type, host, port, username, password, apiToken, sslVerify } = await request.json();

  if (!host) {
    return NextResponse.json({ success: false, error: "Host is required" }, { status: 400 });
  }

  try {
    const defaultPorts: Record<string, number> = {
      proxmox: 8006,
      pfsense: 443,
      opnsense: 443,
      docker: 2375,
      pihole: 80,
      adguard: 3000,
      truenas: 443,
      nut: 3493,
      "nginx-pm": 81,
      traefik: 8080,
    };

    const targetPort = port || defaultPorts[type] || 443;
    const protocol = sslVerify === false || type === "docker" ? "http" : "https";

    const healthUrls: Record<string, string> = {
      proxmox: `${protocol}://${host}:${targetPort}/api2/json/version`,
      docker: `http://${host}:${targetPort}/version`,
      pihole: `http://${host}:${targetPort}/admin/api.php?summary`,
      adguard: `http://${host}:${targetPort}/control/status`,
      truenas: `${protocol}://${host}:${targetPort}/api/v2.0/system/info`,
      "nginx-pm": `http://${host}:${targetPort}/api/`,
      traefik: `http://${host}:${targetPort}/api/overview`,
    };

    const url = healthUrls[type] || `${protocol}://${host}:${targetPort}/`;

    const headers: Record<string, string> = {};
    if (type === "proxmox" && apiToken) {
      headers["Authorization"] = `PVEAPIToken=${apiToken}`;
    } else if (type === "truenas" && apiToken) {
      headers["Authorization"] = `Bearer ${apiToken}`;
    } else if ((type === "adguard" || type === "pfsense" || type === "opnsense") && username && password) {
      headers["Authorization"] = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      headers,
      signal: controller.signal,
      // @ts-expect-error Node fetch supports rejectUnauthorized
      rejectUnauthorized: sslVerify !== false,
    });

    clearTimeout(timeout);

    return NextResponse.json({
      success: response.ok || response.status === 401,
      status: response.status,
      reachable: true,
      authenticated: response.ok,
      message: response.ok
        ? "Connection successful"
        : response.status === 401
          ? "Host reachable but authentication failed — check credentials"
          : `Host returned status ${response.status}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isTimeout = message.includes("abort");

    return NextResponse.json({
      success: false,
      reachable: false,
      authenticated: false,
      message: isTimeout
        ? "Connection timed out — host may be unreachable"
        : `Connection failed: ${message}`,
    });
  }
}
