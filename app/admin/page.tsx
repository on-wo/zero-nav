'use client';

import { useEffect, useState } from 'react';
import type { NavConfig, Category, Site } from '@/lib/types';
import * as Icons from 'lucide-react';

export default function AdminPage() {
  const [config, setConfig] = useState<NavConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/bookmarks');
      const data = await res.json();
      setConfig(data);
    } catch (error) {
      setMessage('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setMessage('保存成功！');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('保存失败');
      }
    } catch (error) {
      setMessage('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const addSite = (categoryIndex: number) => {
    if (!config) return;

    const newSite: Site = {
      title: '新站点',
      url: 'https://example.com',
      icon: '',
      description: ''
    };

    const newConfig = { ...config };
    newConfig.categories[categoryIndex].sites.push(newSite);
    setConfig(newConfig);
  };

  const removeSite = (categoryIndex: number, siteIndex: number) => {
    if (!config) return;

    const newConfig = { ...config };
    newConfig.categories[categoryIndex].sites.splice(siteIndex, 1);
    setConfig(newConfig);
  };

  const updateSite = (categoryIndex: number, siteIndex: number, field: keyof Site, value: string) => {
    if (!config) return;

    const newConfig = { ...config };
    newConfig.categories[categoryIndex].sites[siteIndex][field] = value as never;
    setConfig(newConfig);
  };

  const addCategory = () => {
    if (!config) return;

    const newCategory: Category = {
      name: '新分类',
      sites: []
    };

    setConfig({ ...config, categories: [...config.categories, newCategory] });
  };

  const removeCategory = (index: number) => {
    if (!config) return;

    const newConfig = { ...config };
    newConfig.categories.splice(index, 1);
    setConfig(newConfig);
  };

  if (loading) {
    return <div className="admin-container">加载中...</div>;
  }

  if (!config) {
    return <div className="admin-container">加载失败</div>;
  }

  return (
    <div className="admin-container">
      <style jsx global>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .admin-header h1 {
          font-size: 2rem;
          margin: 0;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background-color: #774cb2;
          color: white;
        }

        .btn-primary:hover {
          background-color: #5f3a8f;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
          margin-left: 0.5rem;
        }

        .btn-secondary:hover {
          background-color: #545b62;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
        }

        .btn-danger:hover {
          background-color: #c82333;
        }

        .btn-add {
          background-color: #28a745;
          color: white;
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
        }

        .btn-add:hover {
          background-color: #218838;
        }

        .message {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .category-section {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .category-header h2 {
          font-size: 1.5rem;
          margin: 0;
        }

        .site-item {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .site-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .form-group {
          margin-bottom: 0.75rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
          font-family: inherit;
        }

        .form-group textarea {
          min-height: 80px;
          font-family: monospace;
        }

        .icon-library {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .icon-library h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          gap: 0.5rem;
          max-height: 200px;
          overflow-y: auto;
        }

        .icon-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-item:hover {
          background: #f0f0f0;
          border-color: #774cb2;
        }
      `}</style>

      <div className="admin-header">
        <h1>导航管理</h1>
        <div>
          <button className="btn btn-primary" onClick={saveConfig} disabled={saving}>
            {saving ? '保存中...' : '保存更改'}
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.href = '/'}>
            返回首页
          </button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      {config.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="category-section">
          <div className="category-header">
            <h2>{category.name}</h2>
            <div>
              <button className="btn btn-add" onClick={() => addSite(categoryIndex)}>
                + 添加站点
              </button>
              <button
                className="btn btn-danger"
                style={{ marginLeft: '0.5rem' }}
                onClick={() => removeCategory(categoryIndex)}
              >
                删除分类
              </button>
            </div>
          </div>

          {category.sites.map((site, siteIndex) => (
            <div key={siteIndex} className="site-item">
              <div className="site-item-header">
                <strong>站点 {siteIndex + 1}</strong>
                <button
                  className="btn btn-danger"
                  onClick={() => removeSite(categoryIndex, siteIndex)}
                >
                  删除
                </button>
              </div>

              <div className="form-group">
                <label>标题</label>
                <input
                  type="text"
                  value={site.title}
                  onChange={(e) => updateSite(categoryIndex, siteIndex, 'title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  value={site.url}
                  onChange={(e) => updateSite(categoryIndex, siteIndex, 'url', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>描述（可选）</label>
                <input
                  type="text"
                  value={site.description || ''}
                  onChange={(e) => updateSite(categoryIndex, siteIndex, 'description', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>图标 SVG 代码（可选）</label>
                <textarea
                  value={site.icon || ''}
                  onChange={(e) => updateSite(categoryIndex, siteIndex, 'icon', e.target.value)}
                  placeholder="粘贴 SVG 代码，或从下方选择图标"
                />
                <div className="icon-library">
                  <h4>常用图标（点击使用）</h4>
                  <div className="icon-grid">
                    {['Home', 'Globe', 'Mail', 'FileText', 'Server', 'Database', 'Cloud', 'Image', 'Settings', 'BarChart', 'Book', 'Calendar'].map((iconName) => {
                      const IconComponent = Icons[iconName as keyof typeof Icons] as any;
                      return IconComponent ? (
                        <div
                          key={iconName}
                          className="icon-item"
                          onClick={() => {
                            const svgString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>${iconName}</title>${getIconPath(iconName)}</svg>`;
                            updateSite(categoryIndex, siteIndex, 'icon', svgString);
                          }}
                        >
                          <IconComponent size={20} />
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <button className="btn btn-secondary" onClick={addCategory}>
        + 添加分类
      </button>
    </div>
  );
}

// Helper to get icon paths (simplified - in a real app you'd want a proper icon library)
function getIconPath(name: string): string {
  // This is a simplified version - lucide-react icons would need proper extraction
  const paths: Record<string, string> = {
    Home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
    Globe: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
    Mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
    FileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
    Server: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>',
  };
  return paths[name] || '';
}
