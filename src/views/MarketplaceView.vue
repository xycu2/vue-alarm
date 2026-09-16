<template>
  <div class="marketplace-container">
    <!-- Заголовок -->
    <div class="marketplace-header">
        <h1>🛒 Marketplace</h1>
        <p>Расширьте возможности своего будильника</p>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number" id="totalModules">0</div>
                <div class="stat-label">Модулей</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="totalMissions">0</div>
                <div class="stat-label">Миссий</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="totalAuthors">0</div>
                <div class="stat-label">Авторов</div>
            </div>
        </div>
    </div>

    <!-- Табы -->
    <div class="tabs">
        <div class="tab active" data-tab="all">Все</div>
        <div class="tab" data-tab="missions">Миссии</div>
        <div class="tab" data-tab="math">Математика</div>
        <div class="tab" data-tab="themes">Темы</div>
        <div class="tab" data-tab="submissions">На проверке</div>
    </div>

    <!-- Список модулей -->
    <div id="modulesList" class="modules-list">
        <!-- Модули будут загружены здесь -->
    </div>

    <!-- Пустое состояние -->
    <div id="emptyState" class="empty-state" style="display: none;">
        <div class="empty-state-icon">📦</div>
        <h3>Нет модулей</h3>
        <p>Здесь появятся установленные модули</p>
    </div>
</div>

<!-- Кнопка назад -->
<RouterLink to="/" class="back-btn">←</RouterLink>
</template>

<script setup>
let currentTab = 'all';

    // Инициализация
    document.addEventListener('DOMContentLoaded', async () => {
        await window.alarmyMarketplace.init();
        renderModules();
        updateStats();
    });

    // Обработчик табов
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            renderModules();
        });
    });

    // Рендер модулей
    function renderModules() {
        const container = document.getElementById('modulesList');
        const emptyState = document.getElementById('emptyState');
        
        let modules = [];

        // Получение модулей в зависимости от таба
        if (currentTab === 'all') {
            const all = window.alarmyMarketplace.getAllModules();
            modules = [
                ...Object.values(all.missions || {}).map(m => ({ ...m, type: 'mission' })),
                ...Object.values(all.mathCategories || {}).map(m => ({ ...m, type: 'math' })),
                ...Object.values(all.themes || {}).map(m => ({ ...m, type: 'theme' }))
            ];
        } else if (currentTab === 'missions') {
            modules = Object.values(window.alarmyMarketplace.getMissions())
                .map(m => ({ ...m, type: 'mission' }));
        } else if (currentTab === 'math') {
            modules = Object.values(window.alarmyMarketplace.getMathCategories())
                .map(m => ({ ...m, type: 'math' }));
        } else if (currentTab === 'themes') {
            modules = Object.values(window.alarmyMarketplace.getThemes())
                .map(m => ({ ...m, type: 'theme' }));
        } else if (currentTab === 'submissions') {
            // Здесь можно добавить отображение модулей на проверке
            modules = [];
        }

        if (modules.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        
        container.innerHTML = modules.map(module => `
            <div class="module-card">
                <div class="module-header">
                    <div class="module-icon">${module.icon || '📦'}</div>
                    <div class="module-info">
                        <div class="module-name">
                            ${module.name}
                            ${module.source === 'marketplace' ? '<span class="submission-badge">Custom</span>' : ''}
                        </div>
                        <div class="module-author">Автор: ${module.author || 'Unknown'}</div>
                    </div>
                </div>
                
                <div class="module-description">${module.description || 'Нет описания'}</div>
                
                ${module.tags && module.tags.length > 0 ? `
                    <div class="module-tags">
                        ${module.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="module-actions">
                    ${module.type === 'mission' ? `
                        <button class="btn-install" onclick="useMission('${module.id}')">
                            Использовать
                        </button>
                    ` : ''}
                    ${module.type === 'math' ? `
                        <button class="btn-install" onclick="useMathCategory('${module.id}')">
                            Использовать
                        </button>
                    ` : ''}
                    ${module.type === 'theme' ? `
                        <button class="btn-install" onclick="applyTheme('${module.id}')">
                            Применить
                        </button>
                    ` : ''}
                    <button class="btn-uninstall" onclick="uninstallModule('${module.type}', '${module.id}')">
                        Удалить
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Обновление статистики
    function updateStats() {
        const stats = window.alarmyMarketplace.getStats();
        document.getElementById('totalModules').textContent = stats.totalModules;
        document.getElementById('totalMissions').textContent = stats.totalMissions;
        document.getElementById('totalAuthors').textContent = '1'; // Пока один автор
    }

    // Использовать миссию
    async function useMission(id) {
        const mission = window.alarmyMarketplace.modules.missions?.[id];
        if (mission) {
            // Сохранение выбора миссии
            localStorage.setItem('alarmy_selected_mission', id);
            alert(`✅ Миссия "${mission.name}" выбрана!`);
        }
    }

    // Использовать математическую категорию
    async function useMathCategory(id) {
        const category = window.alarmyMarketplace.modules.mathCategories?.[id];
        if (category) {
            localStorage.setItem('alarmy_selected_math_category', id);
            alert(`✅ Категория "${category.name}" выбрана!`);
        }
    }

    // Применить тему
    async function applyTheme(id) {
        const theme = window.alarmyMarketplace.modules.themes?.[id];
        if (theme && theme.css) {
            // Динамическая загрузка CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = theme.css;
            document.head.appendChild(link);
            alert(`✅ Тема "${theme.name}" применена!`);
        }
    }

    // Удаление модуля
    async function uninstallModule(type, id) {
        if (confirm('Удалить этот модуль?')) {
            await window.alarmyMarketplace.uninstallModule(type, id);
            renderModules();
            updateStats();
        }
    }
</script>

<style>
.marketplace-container {
            padding: 20px;
            padding-bottom: 80px;
        }

        .marketplace-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            border-radius: 24px;
            margin-bottom: 24px;
            color: white;
        }

        .marketplace-header h1 {
            margin: 0 0 8px 0;
            font-size: 28px;
        }

        .marketplace-header p {
            margin: 0;
            opacity: 0.9;
            font-size: 14px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 20px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.2);
            padding: 16px;
            border-radius: 16px;
            text-align: center;
        }

        .stat-number {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 12px;
            opacity: 0.9;
        }

        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            overflow-x: auto;
            padding-bottom: 8px;
        }

        .tab {
            padding: 12px 20px;
            background: rgba(30, 35, 50, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            color: white;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
        }

        .tab.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: transparent;
        }

        .modules-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .module-card {
            background: rgba(30, 35, 50, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 20px;
            transition: all 0.2s;
        }

        .module-card:hover {
            transform: translateY(-2px);
            border-color: rgba(102, 126, 234, 0.5);
        }

        .module-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 12px;
        }

        .module-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
        }

        .module-info {
            flex: 1;
        }

        .module-name {
            font-size: 18px;
            font-weight: bold;
            color: white;
            margin-bottom: 4px;
        }

        .module-author {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
        }

        .module-description {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 16px;
            line-height: 1.5;
        }

        .module-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }

        .tag {
            padding: 6px 12px;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 12px;
            font-size: 12px;
            color: #a5b4fc;
        }

        .module-actions {
            display: flex;
            gap: 12px;
        }

        .btn-install {
            flex: 1;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 14px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-install:hover {
            transform: scale(1.02);
        }

        .btn-install:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .btn-uninstall {
            flex: 1;
            padding: 14px;
            background: rgba(220, 53, 69, 0.2);
            border: 1px solid rgba(220, 53, 69, 0.3);
            border-radius: 14px;
            color: #ff6b6b;
            font-weight: 600;
            cursor: pointer;
        }

        .btn-details {
            padding: 14px 20px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 14px;
            color: white;
            cursor: pointer;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: rgba(255, 255, 255, 0.5);
        }

        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 16px;
        }

        .back-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        }

        .submission-badge {
            display: inline-block;
            padding: 4px 10px;
            background: rgba(255, 179, 71, 0.2);
            border: 1px solid rgba(255, 179, 71, 0.3);
            border-radius: 8px;
            font-size: 11px;
            color: #ffb347;
            margin-left: 8px;
        }

</style>