// Cloudflare Workers KV types
declare global {
  interface KVNamespace {
    get(key: string, options?: 'text'): Promise<string | null>;
    get(key: string, options: 'json'): Promise<any>;
    get(key: string, options: 'arrayBuffer'): Promise<ArrayBuffer | null>;
    get(key: string, options: 'stream'): Promise<ReadableStream | null>;
    put(key: string, value: string, options?: KVPutOptions): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: KVListOptions): Promise<KVListResult>;
  }

  interface KVPutOptions {
    expiration?: number;
    expirationTtl?: number;
    metadata?: any;
  }

  interface KVListOptions {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }

  interface KVListResult {
    keys: Array<{
      name: string;
      expiration?: number;
      metadata?: any;
    }>;
    list_complete: boolean;
    cursor?: string;
  }
}

export {};
