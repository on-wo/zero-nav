'use client';

import { useEffect, useState } from 'react';
import type { SiteData, Bookmark } from '@/lib/types';

export default function AdminPage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Bookmark>({
    id: '',
    title: '',
    url: '',
    tags: [],
    order: 0,
  });

  useEffect(() => {
    // Load token from localStorage
    const savedToken = localStorage.getItem('admin-token');
    if (savedToken) {
      setToken(savedToken);
      loadData(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async (adminToken?: string) => {
    const tkn = adminToken || token;
    if (!tkn) {
      setMessage('请先输入管理令牌');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/bookmarks', {
        headers: {
          'x-admin-token': tkn,
        },
      });

      if (res.status === 401) {
        setMessage('令牌无效');
        setData(null);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load');
      }

      const json = await res.json();
      setData(json);
      setMessage('');
    } catch (error) {
      setMessage('加载失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveToken = () => {
    localStorage.setItem('admin-token', token);
    loadData(token);
  };

  const addNew = () => {
    const newId = `b_${Date.now()}`;
    setEditForm({
      id: newId,
      title: '新书签',
      url: 'https://example.com',
      tags: [],
      order: data ? data.bookmarks.length + 1 : 1,
    });
    setEditingId(newId);
  };

  const editBookmark = (bookmark: Bookmark) => {
    setEditForm({ ...bookmark });
    setEditingId(bookmark.id);
  };

  const saveBookmark = async () => {
    if (!token) return;

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({
          action: 'upsert',
          item: editForm,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save');
      }

      const json = await res.json();
      setData(json.data);
      setEditingId(null);
      setMessage('保存成功');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('保存失败: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const deleteBookmark = async (id: string) => {
    if (!confirm('确定删除？')) return;
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/bookmarks?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete');
      }

      const json = await res.json();
      setData(json.data);
      setMessage('删除成功');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('删除失败: ' + (error as Error).message);
    }
  };

  const exportData = () => {
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text);

        if (!confirm('导入会覆盖现有数据，确定继续？')) return;

        const res = await fetch('/api/admin/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': token,
          },
          body: JSON.stringify({
            action: 'replace',
            data: imported,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to import');
        }

        const json = await res.json();
        setData(json.data);
        setMessage('导入成功');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('导入失败: ' + (error as Error).message);
      }
    };
    input.click();
  };

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6">管理后台登录</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">管理令牌</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="输入 ADMIN_TOKEN"
            />
          </div>
          {message && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{message}</div>
          )}
          <button
            onClick={saveToken}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-md"
          >
            登录
          </button>
          <div className="mt-4 text-sm text-gray-600">
            <a href="/" className="text-primary hover:underline">← 返回首页</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">导航管理</h1>
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                导出 JSON
              </button>
              <button
                onClick={importData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                导入 JSON
              </button>
              <button
                onClick={addNew}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md"
              >
                + 新增书签
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                返回首页
              </a>
            </div>
          </div>
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>
          )}
          <div className="text-sm text-gray-600">
            版本: {data.version} | 更新时间: {new Date(data.updatedAt).toLocaleString('zh-CN')} | 书签数: {data.bookmarks.length}
          </div>
        </div>

        {editingId && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">编辑书签</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">标题 *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL *</label>
                <input
                  type="url"
                  value={editForm.url}
                  onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">标签 (逗号分隔)</label>
                <input
                  type="text"
                  value={editForm.tags.join(', ')}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="例: 工具, 效率"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">排序 (数字)</label>
                <input
                  type="number"
                  value={editForm.order}
                  onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={saveBookmark}
                disabled={saving}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                取消
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">排序</th>
                <th className="px-4 py-3 text-left">标题</th>
                <th className="px-4 py-3 text-left">URL</th>
                <th className="px-4 py-3 text-left">标签</th>
                <th className="px-4 py-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {data.bookmarks
                .sort((a, b) => a.order - b.order)
                .map((bookmark) => (
                  <tr key={bookmark.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{bookmark.order}</td>
                    <td className="px-4 py-3 font-medium">{bookmark.title}</td>
                    <td className="px-4 py-3">
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block max-w-xs"
                      >
                        {bookmark.url}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {bookmark.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 bg-gray-200 rounded text-xs mr-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => editBookmark(bookmark)}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => deleteBookmark(bookmark.id)}
                        className="text-red-600 hover:underline"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {data.bookmarks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暂无书签，点击上方「新增书签」开始添加
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
