document.addEventListener('DOMContentLoaded', () => {
    const start_button = document.querySelector('.start_button');
    const black_circle = document.querySelector('.black-circle');
    const white_circle = document.querySelector('.white-circle');
    const start_canvas = document.querySelector('.start');

    if (start_button && black_circle && white_circle && start_canvas) {
        // Додаємо обробники подій для start_button


        start_button.addEventListener('click', () => {
            
            start_button.style.transition = 'opacity 0.5s ease-out';
            // start_button.style.opacity = '0';
            black_circle.style.transition = '2s ease';
            white_circle.style.transition = 'opacity 1.5s ease';
            
            black_circle.style.transform = 'scale(2)';
            white_circle.style.opacity = '0';
            black_circle.style.opacity = '0';
            
            setTimeout(() => {
                white_circle.classList.add('hidden');
                black_circle.classList.add('hidden');
                start_button.classList.add('hidden');
                start_button.classList.remove('target');
                start_canvas.style.transition = 'opacity 2s ease';
                
                start_canvas.style.opacity = '0';
                
                start_canvas.innerHTML = '';
                setTimeout(() => {
                    start_canvas.classList.add('hidden');
                }, 2000);
            }, 1000);
            
        });

        startPulsing();
        document.addEventListener('mousemove', handleMouseMove);
    }

    function pulse() {
        const scaleValue = 0.9 + Math.random() * 0.1; 
        const baseDuration = 2000;
        const duration = baseDuration;

        white_circle.style.transition = `transform ${duration}ms linear`;
        white_circle.style.transform = `scale(${scaleValue})`;

        setTimeout(() => {
            white_circle.style.transition = `transform ${duration}ms linear`;
            white_circle.style.transform = 'scale(0.9)';
            const nextPulse = 2000 + Math.random() * 2000;
            setTimeout(startPulsing, nextPulse);
        }, duration);
    }

    function startPulsing() {
        pulse();
    }

    function handleMouseMove(e) {
        let lastX = 0;
        let lastY = 0;
        let isMoving = false;

        const boxRect = black_circle.getBoundingClientRect();
        const centerX = boxRect.left + boxRect.width / 2;
        const centerY = boxRect.top + boxRect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        let rotateX = deltaY / boxRect.height * -35;
        let rotateY = deltaX / boxRect.width * 35;

        const maxRotation = 40;
        rotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX));
        rotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY));

        if (e.clientX > boxRect.left && e.clientX < boxRect.right &&
            e.clientY > boxRect.top && e.clientY < boxRect.bottom) {
            
            lastX = rotateX;
            lastY = rotateY;

            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(() => {
                    black_circle.style.transform = `rotateX(${lastX}deg) rotateY(${lastY}deg)`;
                    isMoving = false;
                });
            }
        } else {
            black_circle.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
    }

});