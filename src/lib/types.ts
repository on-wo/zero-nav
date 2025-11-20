export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
  order: number;
}

export interface CustomElements {
  headerText: string;
  footerText: string;
}

export interface SiteData {
  version: number;
  updatedAt: string;
  bookmarks: Bookmark[];
  meta: {
    customElements: CustomElements;
  };
}

export const DEFAULT_SITE_DATA: SiteData = {
  version: 1,
  updatedAt: new Date().toISOString(),
  bookmarks: [],
  meta: {
    customElements: {
      headerText: '在线服务',
      footerText: 'Powered by zero-nav-next',
    },
  },
};
