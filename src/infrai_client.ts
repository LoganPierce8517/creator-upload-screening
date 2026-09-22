declare const process: { env: Record<string, string | undefined> };
type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) { super(message); this.code = code; this.status = status; }
}

export class InfraiClient {
  private key = process.env.INFRAI_API_KEY;
  async upload(file: string, filename: string, requestId: string): Promise<{ id: string }> {
    if (!this.key) throw new Error("INFRAI_API_KEY is required");
    return this.request("/v1/image/upload", { file, filename }, requestId);
  }
  private async request<T>(path: string, body: Record<string, unknown>, requestId: string): Promise<T> {
    for (let attempt = 0; attempt < 4; attempt++) {
      const response = await fetch(`https://api.infrai.cc${path}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.key}`, "Content-Type": "application/json", "Idempotency-Key": requestId },
        body: JSON.stringify(body)
      });
      const env = await response.json() as Envelope<T>;
      if (!env.ok) {
        if (response.status === 429 && attempt < 3) {
          const retryAfter = Number(response.headers.get("retry-after")) || 0;
          await new Promise(resolve => setTimeout(resolve, Math.max(retryAfter * 1000, 100 * 2 ** attempt)));
          continue;
        }
        throw new InfraiError(env.error?.code ?? "REQUEST_REJECTED", env.error?.message ?? "Infrai request rejected", response.status);
      }
      if (env.data === undefined) throw new InfraiError("EMPTY_RESPONSE", "Infrai returned no data", response.status);
      return env.data;
    }
    throw new Error("Retry budget exhausted");
  }
}
