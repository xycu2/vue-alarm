<template>
<div class="app-container">
    <!-- Статус бар -->
    <div class="status-bar">
        <div class="time-status" id="statusTime">9:41</div>
        <div class="battery-status">
            <span>📶</span>
            <span>🔋 100%</span>
        </div>
    </div>

    <!-- Кнопка смены темы -->
    <button @click="toggleTheme" class="theme-toggle" id="themeToggle" title="Сменить тему">
        <span id="themeIcon">{{ isLight ? '🌙' : '☀️' }}</span>
    </button>

    <!-- Основное время -->
    <div class="clock-card">
        <div class="current-time" id="liveClock">--:--</div>
        <div class="current-date" id="currentDate"></div>
        <div class="greeting" id="greeting">Доброе утро</div>
    </div>

    <!-- Список будильников -->
    <div class="alarms-header">
        <h2>Будильники</h2>
        <span class="alarms-count" id="alarmsCount">0</span>
    </div>
    
    <div id="alarmsListContainer" class="alarms-list">
        <!-- Список будильников будет отображаться здесь -->
    </div>

    <!-- Кнопка добавления -->
    <RouterLink to="/addAlarm" class="fab" id="addAlarmBtn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
        </svg>
        <span>Новый будильник</span>
    </RouterLink>

    <!-- Секция миссий -->
    <div class="missions-section">
        <div class="section-header">
            <h3>Миссии для пробуждения</h3>
            <span class="badge">Alarmy style</span>
        </div>
        <div class="missions-grid">
            <div class="mission-card" data-mission="math">
                <div class="mission-icon math-icon">🧮</div>
                <div class="mission-info">
                    <div class="mission-name">Математика</div>
                    <div class="mission-desc">Решайте математику на скорость</div>
                </div>
                <div class="mission-difficulty hard">Сложная</div>
            </div>
            <div class="mission-card" data-mission="shake">
                <div class="mission-icon shake-icon">📱</div>
                <div class="mission-info">
                    <div class="mission-name">Встряхивание</div>
                    <div class="mission-desc">Трясти телефон 10 раз</div>
                </div>
                <div class="mission-difficulty medium">Средняя</div>
            </div>
            <div class="mission-card" data-mission="memory">
                <div class="mission-icon memory-icon">🎴</div>
                <div class="mission-info">
                    <div class="mission-name">Память</div>
                    <div class="mission-desc">Запомнить последовательность</div>
                </div>
                <div class="mission-difficulty hard">Сложная</div>
            </div>
            <div class="mission-card" data-mission="steps">
                <div class="mission-icon steps-icon">🚶</div>
                <div class="mission-info">
                    <div class="mission-name">Шаги</div>
                    <div class="mission-desc">Сделать 20 шагов</div>
                </div>
                <div class="mission-difficulty easy">Простая</div>
            </div>
        </div>
        
        <!-- Кнопка Marketplace -->
        <RouterLink to="/marketplace" class="marketplace-link" style="margin-top: 20px; width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 16px; color: white; font-weight: 600; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span>🛒</span>
            <span>Marketplace - Больше миссий и тем</span>
        </RouterLink>

        <!-- Сброс настроек -->
        <div class="reset-section">
            <button class="reset-btn" id="resetBtn">🔄 Сбросить настройки</button>
        </div>
    </div>
</div>

<!-- Модалки миссий -->
<div class="mission-modal" id="mathMission">
    <div class="mission-modal-content">
        <div class="mission-modal-header">
            <h2>🧮 Решайте математику на скорость</h2>
            <div class="timer" id="mathTimer">10</div>
        </div>
        <div class="mission-modal-body">
            <div class="math-question" id="mathQuestion"></div>
            <div class="math-options" id="mathOptions"></div>
        </div>
    </div>
</div>

<div class="mission-modal" id="shakeMission">
    <div class="mission-modal-content">
        <div class="mission-modal-header">
            <h2>📱 Встряхните телефон</h2>
            <div class="shake-counter" id="shakeCounter">0/10</div>
        </div>
        <div class="mission-modal-body">
            <div class="shake-animation">
                <div class="phone-icon">📱</div>
            </div>
            <div class="shake-progress">
                <div class="progress-bar" id="shakeProgressBar"></div>
            </div>
            <p class="hint-text">Энергично потрясите устройство или нажмите кнопку</p>
            <button class="demo-btn" id="demoShakeBtn">🔁 Демо-тряска</button>
        </div>
    </div>
</div>

<div class="mission-modal" id="memoryMission">
    <div class="mission-modal-content">
        <div class="mission-modal-header">
            <h2>🎴 Запомните последовательность</h2>
            <div class="memory-level" id="memoryLevel">Уровень 1</div>
        </div>
        <div class="mission-modal-body">
            <div class="memory-sequence" id="memorySequence"></div>
            <div class="memory-buttons" id="memoryButtons"></div>
            <div class="memory-status" id="memoryStatus">Запомните порядок цветов</div>
        </div>
    </div>
</div>

<div class="mission-modal" id="stepsMission">
    <div class="mission-modal-content">
        <div class="mission-modal-header">
            <h2>🚶 Сделайте 20 шагов</h2>
            <div class="steps-counter" id="stepsCounter">0/20</div>
        </div>
        <div class="mission-modal-body">
            <div class="steps-animation">
                <div class="pedometer">👟</div>
            </div>
            <div class="steps-progress">
                <div class="progress-bar" id="stepsProgressBar"></div>
            </div>
            <p class="hint-text">Походите с телефоном или нажмите кнопку</p>
            <button class="demo-btn" id="demoStepsBtn">🚶‍♂️ Демо-шаг</button>
        </div>
    </div>
</div>

<!-- Уведомление о звонке -->
<div class="ringing-notification" id="ringingNotification" style="display: none;">
    <div class="ringing-content">
        <div class="ringing-icon">🔔</div>
        <div class="ringing-text">БУДИЛЬНИК!</div>
        <div class="ringing-subtext">Выполните задание чтобы выключить</div>
    </div>
</div>
</template>

<script setup>
import { useTheme } from '@/utils/changeTheme';

const { isLight, toggleTheme } = useTheme()

</script>