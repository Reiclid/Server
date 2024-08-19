document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.window-game');
    const info = document.querySelector('.info');
    const score_info = document.querySelector('.score-info');
    const width = 10;
    const height = 20;
    const squares = [];

    const previewSquares = [];
    const previewWidth = 4; // Ширина маленької сітки для превью
    const previewGrid = document.querySelector('.window-preblock');

    let nextTetromino;
    let score = 0;
    let lines = 0
    let timespeed = 400;
    let currentTetromino;
    score_info.textContent = `Score: ${score} Lines: ${lines}`
    // info.textContent = "Игра началась";
    
    for (let i = 0; i < previewWidth * previewWidth; i++) {
        let square = document.createElement('div');
        previewGrid.appendChild(square);
        previewSquares.push(square);
    }

    for (let i = 0; i < 200; i++) {
        let square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);
    }

    class Tetromino {
        constructor(shape, position = 0, type = 'unknown') {
            this.shape = shape;  // Массив з координатами блоків
            this.position = position; // Поточна позиція (обертання)
            this.current = this.shape[this.position]; // Текущий набір координат
            this.type = type;
            this.color = tetrominoColors[this.type] || 'gray';
        }

        getType() {
            return this.type;
        }

        draw(){
            this.drawGhost();
            this.current.forEach(index => {
                const square = squares[index];
                if (square) {
                    square.classList.add('block');
                    square.style.backgroundColor = this.color;
                }
            });
            this.x = this.current[1] % width;
            this.y = Math.floor(this.current[1] / width);
        }

        undraw() {
            this.undrawGhost();
            this.current.forEach(index => {
                const square = squares[index];
                if (square) {
                    square.classList.remove('block');
                    square.style.backgroundColor = '';
                }
            });
        }
        drawGhost() {
            let ghostPosition = this.current.map(index => index);
            
            // Просуваємо примарні блоки вниз, поки вони не зіткнуться з перешкодою
            while (!this.checkCollision(ghostPosition)) {
                ghostPosition = ghostPosition.map(index => index + width);
            }
            
            // Зрушуємо примарні блоки вгору на один рядок, щоб компенсувати останнє зіткнення
            ghostPosition = ghostPosition.map(index => index - width);
    
            // Малюємо примарні блоки
            ghostPosition.forEach(index => {
                const square = squares[index];
                if (square) {
                    square.classList.add('ghost');
                }
            });
        }
    
        undrawGhost() {
            // Видаляємо всі примарні блоки перед оновленням
            squares.forEach(square => square.classList.remove('ghost'));
        }
        moveDown() {
            const newPosition = this.current.map(index => index + width);
            if (!this.checkCollision(newPosition)) {
                this.undraw();
                this.current = newPosition;
                score += 10 * timespeed / 80 * (lines + 1);
                this.draw();
            } else {
                // Фіксуємо тетроміно, коли воно стикається з підлогою або іншим блоком
                this.current.forEach(index => squares[index].classList.add('taken'));
                // Виклик функції для появи нового тетроміно тут
                generateNewTetromino();
            }
        }

        rotate() {
            this.undraw();
            this.position = (this.position + 1) % this.shape.length;

            const center = this.current[1];
            this.current = this.shape[this.position].map(index => {
                const relativeIndex = index - this.shape[0][1]; // Віднімаємо початковий центр
                return center + relativeIndex; // Додаємо новий центр до відносного індексу
            });

            if(this.getType() === 'I' && this.position === 0){
                this.current = this.current.map(index => index - width);
            }

            // Перевірка, чи центр знаходиться на лівому або правому краю
            const centerX = center % width;

            if (centerX === 0) { 
                // Якщо центр на лівому краї, зсуваємо фігуру праворуч
                this.current = this.current.map(index => index + 1);
                if(this.getType() === 'I' && this.position === 3){
                    this.current = this.current.map(index => index + 1);
                }
            } else if (centerX === width - 1) { 
                // Якщо центр на правому краї, зсуваємо фігуру ліворуч
                this.current = this.current.map(index => index - 1);
                if(this.getType() === 'I' && this.position === 1){
                    this.current = this.current.map(index => index - 1);
                }
            }

            // Перевірка зіткнення після обертання
            if (this.checkCollision(this.current)) {
                // Якщо є зіткнення зі стіною, пробуємо зрушити фігуру вліво або вправо
                const movedLeft = this.current.map(index => index - 1);
                const movedRight = this.current.map(index => index + 1);

                if (!this.checkCollision(movedLeft) && !this.checkLWallCollision(movedLeft)) {
                    this.current = movedLeft; // Зрушуємо фігуру вліво
                } else if (!this.checkCollision(movedRight) && !this.checkRWallCollision(movedRight)) {
                    this.current = movedRight; // Зрушуємо фігуру вправо
                } else {
                    this.position = (this.position - 1 + this.shape.length) % this.shape.length; // Якщо не вдалось змістити, відміняємо обертання
                    this.current = this.shape[this.position].map(index => {
                        const relativeIndex = index - this.shape[0][1];
                        return center + relativeIndex;
                    });
                }
            }

            this.draw();
        }

        moveLeft() {
            const newPosition = this.current.map(index => index);
            if (!this.checkCollision(newPosition) && !this.checkLWallCollision(newPosition)) {
                this.undraw();
                this.current = this.current.map(index => index - 1);
                this.draw();
            }
        }
        
        moveRight() {
            const newPosition = this.current.map(index => index);
            if (!this.checkCollision(newPosition) && !this.checkRWallCollision(newPosition)) {
                this.undraw();
                this.current = this.current.map(index => index + 1);
                this.draw();
            }
        }
        
        // info(){
        //     const index = this.current[1];
        //     const x = index % width;
        //     const y = Math.floor(index / width);
        //     info.textContent = `X: ${x}, Y: ${y}, P: ${this.position}, T: ${this.type}`;
        // }

        checkCollision(newPosition) {
            return newPosition.some(index => 
                index >= width * height || // Перевірка виходу за межі нижньої границі сітки
                squares[index].classList.contains('taken') // Перевірка наявності вже зайнятого блоку
            );
        }
        checkRWallCollision(newPosition) {
            return newPosition.some(index => index % width === width - 1 || squares[index + 1].classList.contains('taken') // правий край
            );
        }
        checkLWallCollision(newPosition) {
            return newPosition.some(index => index % width === 0 || squares[index - 1].classList.contains('taken')  // лівий край
            );
        }

        static removeFullRows() {
            for (let row = 0; row < height; row++) {
                let isRowFull = true;
                for (let col = 0; col < width; col++) {
                    if (!squares[row * width + col].classList.contains('taken')) {
                        isRowFull = false;
                        break;
                    }
                }
                if (isRowFull) {
                    for (let col = 0; col < width; col++) {
                        squares[row * width + col].classList.remove('taken', 'block');
                        squares[row * width + col].style.backgroundColor = '';
                    }
                    const removedSquares = squares.splice(row * width, width);
                    squares.unshift(...removedSquares);
                    squares.forEach(cell => grid.appendChild(cell));
                    lines++;
                }
            }
        }
    }
    const tetrominoColors = {
        'I': 'cyan',
        'O': 'yellow',
        'T': 'purple',
        'S': 'green',
        'Z': 'red',
        'J': 'blue',
        'L': 'orange'
    };
    function generateNewTetromino() {
        Tetromino.removeFullRows();

        // Список усіх можливих фігур (Тетроміно)
        const tetrominoes = [
            // L-shaped Tetromino
            { shape: [
                [5, width + 5, width * 2 + 5, 4],
                [width + 4, width + 5, width + 6, 6],
                [5, width + 5, width * 2 + 5, width * 2 + 6],
                [width + 6, width + 5, width * 2 + 4, width + 4]
            ], type: 'L' },
            // Z-shaped Tetromino
            { shape: [
                [5, width + 5, width + 4, width * 2 + 4],
                [width + 6, width + 5, 5, 4],
                [6, width + 5, width + 6, width * 2 + 5],
                [width + 4, width + 5, width * 2 + 6, width * 2 + 5]
            ], type: 'Z' },
            // T-shaped Tetromino
            { shape: [
                [5, width + 5, width + 4, width + 6],
                [5, width + 5, width + 6, width * 2 + 5],
                [width + 4, width + 5, width + 6, width * 2 + 5],
                [5, width + 5, width + 4, width * 2 + 5]
            ], type: 'T' },
            // O-shaped Tetromino
            { shape: [
                [4, 5, width + 4, width + 5],
                [4, 5, width + 4, width + 5],
                [4, 5, width + 4, width + 5],
                [4, 5, width + 4, width + 5]
            ], type: 'O' },
            // I-shaped Tetromino
            { shape: [
                [5, width + 5, width * 2 + 5, width * 3 + 5], 
                [width + 4, width + 5, width + 6, width + 7], 
                [6, width * 2 + 6, width + 6, width * 3 + 6],
                [width * 1 + 3, width * 1 + 4, width * 1 + 5, width * 1 + 6]
            ], type: 'I' },
            // S-shaped Tetromino (віддзеркалене Z)
            { shape: [
                [4, width + 5, width + 4, width * 2 + 5],
                [6, width + 5, 5, width + 4],
                [5, width + 5, width + 6, width * 2 + 6],
                [width * 2 + 4, width + 5, width * 2 + 5, width + 6]
            ], type: 'S' },
            // J-shaped Tetromino
            { shape: [
                [5, width + 5, width * 2 + 5, 6],
                [width + 4, width + 5, width + 6, width * 2 + 6],
                [5, width + 5, width * 2 + 5, width * 2 + 4],
                [width + 6, width + 5, 4, width + 4]
            ], type: 'J' },
        ];
    
         // Якщо nextTetromino вже визначений, використовуйте його, інакше генеруйте новий
         const tetrominoData = nextTetromino || tetrominoes[Math.floor(Math.random() * tetrominoes.length)];

         // Генеруємо новий Tetromino для превью
         nextTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
 
         // Створення нового Tetromino
         const newTetromino = new Tetromino(tetrominoData.shape, 0, tetrominoData.type);

        // Перевірка на те, чи програв гравець
        if (newTetromino.checkCollision(newTetromino.current)) {
            info.textContent = "Game Over";
            clearInterval(timerId);  // Зупинка гри
            return;
        } else {
            // Заміна поточного тетроміно на новий
            currentTetromino = newTetromino;
            currentTetromino.draw();
        }
        // Відображаємо наступний Tetromino в превью
        displayNextTetromino(nextTetromino.shape[0], nextTetromino.type);
    }
    function displayNextTetromino(shape, type) {
        previewSquares.forEach(square => {
            square.classList.remove('block');
            square.style.backgroundColor = '';
        });
    
        let offsetX = 0;
        let offsetY = 0;
    
        // Налаштування зміщень для центрування кожного типу фігури в прев'ю
        switch(type) {
            case 'I':
                offsetX = 0; 
                offsetY = 1; // Зміщення для 'I' фігури
                break;
            case 'O':
                offsetX = 3; 
                offsetY = -1; // Зміщення для 'O' фігури
                break;
            case 'T':
            case 'L':
                offsetX = 3; 
                offsetY = -1; // Зміщення для інших фігур
                break;
            case 'J':
                offsetX = 4; 
                offsetY = -1; // Зміщення для інших фігур
                break;
            case 'S':
            case 'Z':
                offsetX = 3;
                offsetY = -1;
                break;
        }

    
        // Перетворення індексів для сітки прев'ю з шириною 4 блоки
        shape.forEach(index => {
            const x = (index % width) - offsetX;  // Перетворення для ширини 4
            const y = Math.floor(index / width) - offsetY;
            const previewIndex = y * 4 + x;  // Використовуємо 4 для сітки прев'ю
    
            if (previewSquares[previewIndex]) {
                previewSquares[previewIndex].classList.add('block');
                previewSquares[previewIndex].style.backgroundColor = tetrominoColors[type];
            }
        });
    }
    // Генеруємо перше тетроміно після створення сітки
    generateNewTetromino();
    timerId = setInterval(() => score_info.textContent = `Score: ${score} Lines: ${lines}`, 50);
    // Оновлюємо інформацію про позицію тетроміно
    timerId = setInterval(() => {
        document.addEventListener('keydown', control);
        

        currentTetromino.moveDown()
        currentTetromino.info();
    }, timespeed);

    
    function control(e) {
        if (e.keyCode === 37) {
            currentTetromino.moveLeft();
        } else if (e.keyCode === 39) {
            currentTetromino.moveRight();
        } else if (e.keyCode === 40) {
            currentTetromino.moveDown();
        } else if (e.keyCode === 38) {
            currentTetromino.rotate();
        }
    }
    

});
