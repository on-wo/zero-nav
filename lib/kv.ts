import type { NavConfig } from './types';

// For development, we'll use a JSON file
// In production with Cloudflare, this will be replaced with KV bindings
const DEFAULT_CONFIG: NavConfig = {
  categories: [
    {
      name: '在线服务',
      sites: []
    }
  ]
};

// Mock KV storage for local development
let localStore: NavConfig | null = null;

export async function getConfig(): Promise<NavConfig> {
  // In Cloudflare Workers/Pages, use:
  // const value = await env.BOOKMARKS.get('config');

  // For now, use local storage or default
  if (localStore) {
    return localStore;
  }

  // Try to load from file system (only works in Node.js environment)
  try {
    const fs = await import('fs/promises');
    const yaml = await import('js-yaml');
    const configPath = process.cwd() + '/config.yml';
    const fileContent = await fs.readFile(configPath, 'utf8');
    const config = yaml.load(fileContent) as NavConfig;
    return config;
  } catch (error) {
    console.log('Using default config');
    return DEFAULT_CONFIG;
  }
}

export async function setConfig(config: NavConfig): Promise<void> {
  // In Cloudflare Workers/Pages, use:
  // await env.BOOKMARKS.put('config', JSON.stringify(config));

  localStore = config;

  // Also save to file for persistence in development
  try {
    const fs = await import('fs/promises');
    const yaml = await import('js-yaml');
    const configPath = process.cwd() + '/config.yml';
    const yamlContent = yaml.dump(config);
    await fs.writeFile(configPath, yamlContent, 'utf8');
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}
