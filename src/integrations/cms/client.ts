// CMS client placeholder
export interface CMSConfig {
  baseUrl: string;
  token?: string;
}

export class CMSClient {
  private config: CMSConfig;

  constructor(config: CMSConfig) {
    this.config = config;
  }

  async fetchPosts(): Promise<unknown[]> {
    // Placeholder fetching posts
    console.log("CMSConfig base URL:", this.config.baseUrl);
    return [];
  }

  async fetchPostBySlug(slug: string): Promise<unknown | null> {
    // Placeholder slug fetching
    console.log("CMSConfig fetch slug:", slug);
    return null;
  }
}
