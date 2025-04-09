// Получение элементов интерфейса
const urlInput = document.getElementById('urlInput');
const intervalInput = document.getElementById('intervalInput');
const durationInput = document.getElementById('durationInput');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusBox = document.getElementById('statusBox');
const logBox = document.getElementById('logBox');

// Переменные для управления процессом
let isRunning = false;
let intervalId = null;
let windowRef = null;
let cycleCount = 0;

// Функция логирования
function log(message) {
    const date = new Date();
    const timeStr = date.toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = `[${timeStr}] ${message}`;
    logBox.insertBefore(logEntry, logBox.firstChild);
}

// Функция запуска автоматического открытия
function startAutoOpen() {
    if (isRunning) return;
    
    const url = urlInput.value.trim();
    const interval = parseInt(intervalInput.value);
    const duration = parseInt(durationInput.value);
    
    if (!url) {
        alert('Пожалуйста, введите URL сайта');
        return;
    }
    
    if (isNaN(interval) || interval < 1) {
        alert('Интервал должен быть не менее 1 мс');
        return;
    }
    
    if (isNaN(duration) || duration < 1) {
        alert('Длительность должна быть не менее 1 мс');
        return;
    }
    
    isRunning = true;
    cycleCount = 0;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    urlInput.disabled = true;
    intervalInput.disabled = true;
    durationInput.disabled = true;
    
    statusBox.textContent = 'Запущено';
    statusBox.style.backgroundColor = '#e8f5e9';
    
    log('Автоматическое открытие запущено');
    log(`Интервал: ${interval} мс, Длительность: ${duration} мс`);
    
    // Функция одного цикла открытия
    function openCycle() {
        cycleCount++;
        log(`Цикл ${cycleCount}: Открытие сайта ${url}`);
        
        // Проверяем, не закрыто ли окно уже
        if (windowRef && !windowRef.closed) {
            try {
                windowRef.close();
                log(`Закрытие предыдущего окна`);
            } catch (e) {
                log(`Ошибка при закрытии окна: ${e.message}`);
            }
        }
        
        try {
            // Открываем новое окно
            windowRef = window.open(url, '_blank', 'width=800,height=600');
            
            // Закрываем окно через указанную длительность
            setTimeout(() => {
                if (windowRef && !windowRef.closed) {
                    windowRef.close();
                    log(`Цикл ${cycleCount}: Закрытие сайта после ${duration} мс`);
                }
            }, duration);
        } catch (e) {
            log(`Ошибка при открытии окна: ${e.message}`);
        }
    }
    
    // Запускаем первый цикл сразу
    openCycle();
    
    // Запускаем остальные циклы с заданным интервалом
    intervalId = setInterval(openCycle, interval);
}

// Функция остановки
function stopAutoOpen() {
    if (!isRunning) return;
    
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    
    if (windowRef && !windowRef.closed) {
        try {
            windowRef.close();
        } catch (e) {
            log(`Ошибка при закрытии окна: ${e.message}`);
        }
    }
    
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    urlInput.disabled = false;
    intervalInput.disabled = false;
    durationInput.disabled = false;
    
    statusBox.textContent = 'Остановлено';
    statusBox.style.backgroundColor = '#ffebee';
    
    log('Автоматическое открытие остановлено');
}

// Обработчики событий
startBtn.addEventListener('click', startAutoOpen);
stopBtn.addEventListener('click', stopAutoOpen);

// Информация при загрузке страницы
log('Система готова к запуску');

// Обработка ошибок
window.onerror = function(message, source, lineno, colno, error) {
    log(`Произошла ошибка: ${message}`);
    return true;
};

// Обработка закрытия страницы
window.addEventListener('beforeunload', () => {
    if (isRunning) {
        stopAutoOpen();
    }
}); 