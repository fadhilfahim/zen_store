declare module "html-pdf" {
  interface CreateOptions {
    format?: string;
    margin?: number | string | { top?: string | number; right?: string | number; bottom?: string | number; left?: string | number };
    orientation?: "portrait" | "landscape";
  }

  interface ToFileCallback {
    (err: Error | null, res?: { filename: string }): void;
  }

  interface ToBufferCallback {
    (err: Error | null, buffer?: Buffer): void;
  }

  const create: {
    (html: string, options: CreateOptions, callback: (err: Error | null, pdf?: any) => void): void;
    (html: string, options: CreateOptions): Promise<Buffer>;
  };

  export { create };
}
