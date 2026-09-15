<template>
  <div class="add-alarm-container">
    <div class="add-alarm-card">
        <div class="add-alarm-header">
            <RouterLink to="/" class="back-btn" id="backBtn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </RouterLink>
            <button class="theme-toggle" id="themeToggle" title="Сменить тему">
                <span id="themeIcon">☀️</span>
            </button>
            <h1 id="modalTitle">Новый будильник</h1>
            <p>Настройте время и миссию</p>
        </div>
        
        <div class="add-alarm-body">
            <!-- Предпросмотр времени -->
            <div class="time-preview">
                <div class="time-preview-value" id="timePreview">07:30</div>
            </div>
            
            <!-- Выбор времени -->
            <div class="form-group">
                <label>Время</label>
                <div class="time-picker-modern">
                    <div class="time-unit">
                        <button class="time-stepper up" data-target="hour">▲</button>
                        <input type="number" id="hourInput" min="0" max="23" value="7" step="1">
                        <button class="time-stepper down" data-target="hour">▼</button>
                    </div>
                    <span class="time-separator">:</span>
                    <div class="time-unit">
                        <button class="time-stepper up" data-target="minute">▲</button>
                        <input type="number" id="minuteInput" min="0" max="59" value="30" step="1">
                        <button class="time-stepper down" data-target="minute">▼</button>
                    </div>
                </div>
            </div>
            
            <!-- Выбор дней недели -->
            <div class="form-group">
                <label>Повторять в дни</label>
                <div class="weekdays-buttons">
                    <button type="button" class="weekday-btn" data-day="1">Пн</button>
                    <button type="button" class="weekday-btn" data-day="2">Вт</button>
                    <button type="button" class="weekday-btn" data-day="3">Ср</button>
                    <button type="button" class="weekday-btn" data-day="4">Чт</button>
                    <button type="button" class="weekday-btn" data-day="5">Пт</button>
                    <button type="button" class="weekday-btn" data-day="6">Сб</button>
                    <button type="button" class="weekday-btn" data-day="0">Вс</button>
                </div>
                <div class="repeat-options">
                    <button type="button" id="selectAllDays" class="repeat-option-btn">Все дни</button>
                    <button type="button" id="selectWeekdays" class="repeat-option-btn">Будни</button>
                    <button type="button" id="selectWeekend" class="repeat-option-btn">Выходные</button>
                    <button type="button" id="clearDays" class="repeat-option-btn">Очистить</button>
                </div>
            </div>
            
            <!-- Выбор миссии -->
            <div class="form-group">
                <label>Миссия для пробуждения</label>
                <select id="missionSelect" class="mission-dropdown">
                    <option value="math">🧮 Математика — решите пример</option>
                    <option value="shake">📱 Встряхивание — потрясите телефон</option>
                    <option value="memory">🎴 Память — запомните последовательность</option>
                    <option value="steps">🚶 Шаги — сделайте 20 шагов</option>
                </select>
            </div>
            
            <!-- Выбор категории математики (показывается только для математической миссии) -->
            <div class="form-group" id="mathCategoryGroup" style="display: none;">
                <label>Категория математических задач</label>
                <select id="mathCategorySelect" class="mission-dropdown">
                    <option value="1">Сложные примеры — например: (a + b - c) * √d (15 сек)</option>
                    <option value="2">Линейные уравнения — например: 3 * (2x + 5) = 7 (40 сек)</option>
                    <option value="3">Квадратные уравнения — например: 2x²+7x+3 = 0 (60 сек)</option>
                </select>
            </div>
            
            <!-- Выбор звука будильника -->
            <div class="form-group">
                <label>Звук будильника</label>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <select id="ringtoneSelect" class="mission-dropdown" style="flex: 1;">
                        <option value="alarm_sound_1.mp3">alarm_sound_1.mp3</option>
                        <option value="alarm_sound_2.mp3">alarm_sound_2.mp3</option>
                    </select>
                    <button id="deleteRingtoneBtn" type="button" title="Удалить выбранный звук" style="padding: 12px 16px; background: rgba(255,71,87,0.15); border: 1px solid rgba(255,71,87,0.5); border-radius: 12px; color: #ff4757; cursor: pointer; font-size: 16px; line-height: 1;">
                        🗑️
                    </button>
                </div>
                <div style="margin-top: 10px;">
                    <label for="uploadSoundInput" class="upload-label" style="display: inline-block; padding: 12px 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 25px; color: white; cursor: pointer;">
                        📁 Загрузить свой звук
                        <input type="file" id="uploadSoundInput" accept=".mp3,.wav,.ogg,.flac" style="display: none;">
                    </label>
                    <span id="uploadStatus" style="margin-left: 10px; font-size: 13px; color: white;"></span>
                </div>
            </div>
        </div>
        
        <div class="add-alarm-footer">
            <button class="btn-cancel" id="cancelBtn">Отмена</button>
            <button class="btn-save" id="saveBtn">Сохранить</button>
        </div>
        
        <div class="delete-section" id="deleteSection" style="display: none;">
            <div class="add-alarm-footer" style="padding-top: 0;">
                <button class="btn-delete" id="deleteBtn">🗑️ Удалить будильник</button>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
@import '../assets/addAlarm.css';

</style>