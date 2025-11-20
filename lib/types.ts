export interface Site {
  title: string;
  url: string;
  description?: string;
  icon?: string;
}

export interface Category {
  name: string;
  icon?: string;
  sites: Site[];
}

export interface NavConfig {
  categories: Category[];
}
