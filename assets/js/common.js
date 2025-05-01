"use strict";

// 安全获取图标
function getSafeIcon(icon) {
    if (!icon || typeof icon !== 'string' || !icon.includes('<svg')) {
        return `<svg t="1746080019931" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9948" width="24" height="24"><path d="M904 120H120c-30.9 0-56 25.1-56 56v560c0 30.9 25.1 56 56 56h280v56h-84c-15.5 0-28 12.5-28 28s12.5 28 28 28h392c15.5 0 28-12.5 28-28s-12.5-28-28-28h-84v-56h280c30.9 0 56-25.1 56-56V176c0-30.9-25.1-56-56-56zM568 848H456v-56h112v56z m336-112H120v-56h784v56zM120 624V176h784v448H120z" p-id="9949"></path></svg>`;
    }
    return icon.trim();
}

// 创建分类容器
function createCategoryContainer() {
    const container = document.createElement('div');
    container.className = 'categories-container';
    return container;
}

// 创建单个分类
function createCategoryBlock(category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category-block';

    // 分类标题
    const header = document.createElement('div');
    header.className = 'category-header';

    const icon = document.createElement('span');
    icon.className = 'category-icon';
    icon.innerHTML = getSafeIcon(category.icon);

    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = category.name;

    // header.appendChild(icon);
    // header.appendChild(title);
    // categoryDiv.appendChild(header);

    // 网站列表
    const siteList = document.createElement('ul');
    siteList.className = 'category-list';

    if (category.sites && Array.isArray(category.sites)) {
        category.sites.forEach(site => {
            if (site) {
                const li = document.createElement('li');
                const a = document.createElement('a');

                a.href = site.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.innerHTML = `${getSafeIcon(site.icon)}<span class="site-name">${site.title}</span>`;

                if (site.description) {
                    const desc = document.createElement('span');
                    desc.className = 'site-description';
                    desc.textContent = site.description;
                    //a.appendChild(desc);
                }

                li.appendChild(a);
                siteList.appendChild(li);
            }
        });
    }

    categoryDiv.appendChild(siteList);
    return categoryDiv;
}

async function eventHandler() {
    try {
        const container = document.getElementById('content');
        container.innerHTML = '<div class="loading">loading...</div>';
        const response = await fetch('config.yml');
        if (!response.ok) {
            throw new Error(`http error, code: ${response.status}`);
        }
        const yamlText = await response.text();
        if (yamlText) {
            const config = jsyaml.load(yamlText);
            container.innerHTML = '';
            if (config && config?.categories && Array.isArray(config.categories) && config.categories.length > 0) {
                const fragment = document.createDocumentFragment();
                // loop
                config.categories.forEach((category, index) => {
                    if (category) {
                        const categoryBlock = createCategoryBlock(category);
                        fragment.appendChild(categoryBlock);
                    }
                });

                if (fragment.children.length === 0) {
                    container.innerHTML = '<div class="empty">empty</div>';
                } else {
                    container.appendChild(fragment);
                }
            }
        }
    } catch (error) {
        container.innerHTML = '';
        console.error('error:', error);
    }
}

if (document.readyState !== 'loading') {
    eventHandler();
} else {
    document.addEventListener('DOMContentLoaded', eventHandler, { once: true });
}