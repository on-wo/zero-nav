'use client';

import { useEffect, useState } from 'react';
import type { NavConfig, Category, Site } from '@/lib/types';

// Default icon component
function DefaultIcon() {
  return (
    <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path d="M904 120H120c-30.9 0-56 25.1-56 56v560c0 30.9 25.1 56 56 56h280v56h-84c-15.5 0-28 12.5-28 28s12.5 28 28 28h392c15.5 0 28-12.5 28-28s-12.5-28-28-28h-84v-56h280c30.9 0 56-25.1 56-56V176c0-30.9-25.1-56-56-56zM568 848H456v-56h112v56z m336-112H120v-56h784v56zM120 624V176h784v448H120z" fill="currentColor"></path>
    </svg>
  );
}

export default function Home() {
  const [config, setConfig] = useState<NavConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load config:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main>
        <h1><a href="#">在线服务</a></h1>
        <div className="loading">loading...</div>
      </main>
    );
  }

  if (!config) {
    return (
      <main>
        <h1><a href="#">在线服务</a></h1>
        <div className="empty">加载失败</div>
      </main>
    );
  }

  return (
    <main>
      <h1><a href="#">在线服务</a></h1>
      <div id="content">
        {config.categories.map((category, index) => (
          <div key={index} className="category-block">
            <ul className="category-list">
              {category.sites.map((site, siteIndex) => (
                <li key={siteIndex}>
                  <a href={site.url} target="_blank" rel="noopener noreferrer">
                    {site.icon ? (
                      <span dangerouslySetInnerHTML={{ __html: site.icon }} />
                    ) : (
                      <DefaultIcon />
                    )}
                    <span className="site-name">{site.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
