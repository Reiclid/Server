let canvas = document.getElementById('noisy-canvas'),
    ctx = canvas.getContext('2d');
let frames = []; // Масив для збереження кадрів шуму
const numberOfFrames = 5; // Кількість кадрів шуму
let currentFrame = 0; // Поточний кадр

function main() {
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    generateNoiseFrames(); // Генеруємо всі кадри шуму
    animateNoise(); // Запускаємо анімацію перемикання кадрів
}

function getRandom() {
    return Math.random() * 255;
}

function generateNoise() {
    let imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const color = getRandom();
        imageData.data[i]     = color;
        imageData.data[i + 1] = color;
        imageData.data[i + 2] = color;
        imageData.data[i + 3] = 255;
    }
    return imageData;
}

function generateNoiseFrames() {
    frames = []; // Очищаємо масив кадрів
    for (let i = 0; i < numberOfFrames; i++) {
        frames.push(generateNoise());
    }
}

function updateCanvasSize() {
    ctx.canvas.height = canvas.offsetHeight;
    ctx.canvas.width  = canvas.offsetWidth;
    generateNoiseFrames(); // Перегенеруємо кадри при зміні розміру
}

function animateNoise() {
    ctx.putImageData(frames[currentFrame], 0, 0); // Відображаємо поточний кадр
    currentFrame = (currentFrame + 1) % numberOfFrames; // Переходимо до наступного кадру
    setTimeout(animateNoise, 50); // Задаємо інтервал для перемикання кадрів (100 мс = 10 кадрів в секунду)
}

main();