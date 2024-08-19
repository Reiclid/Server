const circles = [];

    function createCircle(x, y) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        document.body.appendChild(circle);
        circles.push(circle);
    }

    function generateGrid() {
        // Видаляємо всі попередні круги
        document.querySelectorAll('.circle').forEach(circle => circle.remove());
        circles.length = 0;

        // Отримуємо ширину та висоту вікна
        const bodyWidth = document.body.clientWidth;
        const bodyHeight = document.body.clientHeight;

        // Визначаємо розмір круга та інтервал між кругами
        const w = 60; // Збільшив інтервал для зменшення кількості кругів
        const circleSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--circle-size'));

        // Створюємо сітку з кругів
        for (let y = w / 2; y < bodyHeight; y += w) {
            for (let x = w / 2; x < bodyWidth; x += w) {
                createCircle(x, y);
            }
        }
    }

    function handleMouseMove(e) {
        const maxDistance = 200;
        const checkDistance = 300; // Максимальна відстань для перевірки кругів

        circles.forEach(circle => {
            const rect = circle.getBoundingClientRect();
            const circleX = rect.left + rect.width / 2;
            const circleY = rect.top + rect.height / 2;
            const distance = Math.hypot(e.clientX - circleX, e.clientY - circleY);

            if (distance < checkDistance) { // Тільки перевірка кругів, які достатньо близькі
                const scale = Math.max(1, (maxDistance - distance) / maxDistance * (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--max-scale') - 1)) + 1);
                circle.style.transform = `scale(${scale})`;
            } else {
                circle.style.transform = 'scale(1)'; // Відновлення розміру для далеких кругів
            }
        });
    }

    function startAnimation() {
        window.addEventListener('mousemove', handleMouseMove);
    }

    // Ініціалізуємо сітку при завантаженні сторінки
    generateGrid();

    // Перебудова сітки при зміні розміру вікна
    window.addEventListener('resize', generateGrid);

    // Старт анімації
    startAnimation();