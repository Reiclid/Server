const FPS = document.querySelector('.FPS');
    let lastFrameTime = performance.now();
    let fps = 0;

    function calculateFPS() {
        const now = performance.now();
        fps = Math.round(1000 / (now - lastFrameTime));
        lastFrameTime = now;
        
        // Виводимо FPS в консоль
        FPS.textContent = `FPS: ${fps}`
        
        requestAnimationFrame(calculateFPS);
    }
    calculateFPS();