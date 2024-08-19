// Додаємо обробник подій для елемента .box-item
const MP1 = document.querySelector('.MP1');
if (MP1) {
    MP1.addEventListener('click', () => {
        window.open('https://drive.google.com/file/d/1hvtHyWdGOgwU_ZgA0YHFtQCJWzVmZRYg/view?usp=sharing', '_blank');
    });
}
const MP2 = document.querySelector('.MP2');
if (MP2) {
    MP2.addEventListener('click', () => {
        window.open('https://drive.google.com/file/d/1Qu-LL_gVHN6S91iTSlhynbCyysfpz0Ao/view?usp=sharing', '_blank');
    });
}
const MP3 = document.querySelector('.MP3');
if (MP3) {
    MP3.addEventListener('click', () => {
        window.open('https://drive.google.com/file/d/14U8s9EhFGNn4PcXrGlQsrbpoFnzjz-Dg/view?usp=sharing', '_blank');
    });
}
const RP1 = document.querySelector('.RP1');
if (RP1) {
    RP1.addEventListener('click', () => {
        window.open('https://drive.google.com/file/d/1I_oH-Vqcg5TxsEeQ_qjsez1lacYEfDor/view?usp=sharing', '_blank');
    });
}
const SP2 = document.querySelector('.SP2');
if (SP2) {
    SP2.addEventListener('click', () => {
        window.open('https://modrinth.com/shader/complementary-reimagined', '_blank');
    });
}
let currentSection = 1; // Починаємо з другого екрана (Mod)
const container = document.querySelector('nav');
const sections = document.querySelectorAll('.section');

// Встановлюємо початкове положення контейнера на другий екран
container.style.transform = `translateX(-${currentSection * 100}vw)`;
// Виводимо кількість секцій і початкову секцію в консоль
console.log(`Кількість секцій: ${sections.length}`);
console.log(`Поточна секція: ${currentSection + 1}`);

document.getElementById('navigationr').addEventListener('click', () => {
    if (currentSection < sections.length - 1) {
        currentSection++;
        container.style.transform = `translateX(-${currentSection * 100}vw)`;
        
        // Виводимо поточну секцію в консоль після перемикання
        console.log(`Кількість секцій: ${sections.length}`);
        console.log(`Поточна секція: ${currentSection + 1}`);
    }
});

document.getElementById('navigationl').addEventListener('click', () => {
    if (currentSection > 0) {
        currentSection--;
        container.style.transform = `translateX(-${currentSection * 100}vw)`;
        
        // Виводимо поточну секцію в консоль після перемикання
        console.log(`Кількість секцій: ${sections.length}`);
        console.log(`Поточна секція: ${currentSection + 1}`);
    }
});


const circle_main = document.querySelector('.circle-main');
const circle_main_in = document.querySelector('.circle-main-in');
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const lerpFactor = 0.2;  // Чим менше значення, тим повільніше згладжування

document.addEventListener('mousemove', function(e) {
    const rect = circle_main.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    circle_main.style.opacity = 1;
    targetX = e.clientX - width / 2;  // Центрування по горизонталі
    targetY = e.clientY - height / 2; // Центрування по вертикалі
    

});

function animate() {
    // Лінійна інтерполяція
    currentX += (targetX - currentX) * lerpFactor;
    currentY += (targetY - currentY) * lerpFactor;

    circle_main.style.left = `${currentX}px`;
    circle_main.style.top = `${currentY}px`;

    requestAnimationFrame(animate);
}

// Запускаємо анімацію
animate();

// Обробник для приховування об'єкта, коли курсор покидає вікно
window.addEventListener('mouseout', () => {
    circle_main.style.opacity = 0; // Приховуємо об'єкт
});


// Додаємо обробники подій для елементів з класом "target"
const targets = document.querySelectorAll('.target');

targets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        circle_main_in.style.transform = 'scale(3)';
    });

    target.addEventListener('mouseleave', () => {
        circle_main_in.style.transform = 'scale(1)';
    });
});
