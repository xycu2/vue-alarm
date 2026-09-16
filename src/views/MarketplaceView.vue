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
@import '../assets/marketplace.css'

</style>