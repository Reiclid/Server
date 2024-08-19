let lastX = 0;
let lastY = 0;
let isMoving = false;

const boxes = document.querySelectorAll('.box-item');

boxes.forEach((box) => {
    document.addEventListener('mousemove', (e) => {
        const boxRect = box.getBoundingClientRect();
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
                    box.style.transform = `rotateX(${lastX}deg) rotateY(${lastY}deg)`;
                    isMoving = false;
                });
            }
        } else {
            box.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
    });

    box.addEventListener('mouseout', () => {
        box.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
});