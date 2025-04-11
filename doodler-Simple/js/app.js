document.addEventListener("DOMContentLoaded", () => {
    // Cuando la página web se carga completamente, empieza el juego

    const grid = document.querySelector(".grid");
    // "grid" es el área donde se muestra el juego

    const doodler = document.createElement("div");
    // "doodler" es el personaje que salta

    let doodlerLeftSpace = 50;
    let doodlerBottomSpace = 150;
    // Estas variables guardan la posición del personaje

    let platformCount = 5;
    // El número de plataformas en el juego

    let platforms = [];
    // Una lista para guardar todas las plataformas

    let upTimerId;
    let downTimerId;
    // Relojes para controlar el salto y la caída del personaje

    let isOnPlatform = false;
    // Indica si el personaje está sobre una plataforma

    function createDoodler() {
        // Esta función crea el personaje en el juego
        grid.appendChild(doodler);
        doodler.classList.add("doodler");
        doodler.style.left = doodlerLeftSpace + "px";
        doodler.style.bottom = doodlerBottomSpace + "px";
    }

    class Platform {
        // Esta "clase" es como una receta para crear plataformas
        constructor(newPlatBottom, moving = false) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement("div");
            this.moving = moving;
            this.direction = Math.random() > 0.5 ? 1 : -1;

            const visual = this.visual;
            visual.classList.add("platform");
            visual.style.left = this.left + "px";
            visual.style.bottom = this.bottom + "px";
            grid.appendChild(visual);
        }

        move() {
            // Esta función mueve las plataformas que se mueven
            if (this.moving) {
                this.left += this.direction * 2;
                if (this.left < 0 || this.left > 315) {
                    this.direction *= -1;
                }
                this.visual.style.left = this.left + "px";
            }
        }
    }

    function createPlatforms() {
        // Crea todas las plataformas del juego
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platformGap;
            let moving = Math.random() > 0.5;
            let newPlatform = new Platform(newPlatBottom, moving);
            platforms.push(newPlatform);
        }
    }

    function movePlatforms() {
        // Mueve las plataformas hacia abajo cuando el personaje sube mucho
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + "px";
                platform.move();
            });
        } else {
            platforms.forEach(platform => {
                platform.move();
            });
        }
    }

    function jump() {
        // Hace que el personaje salte
        clearInterval(downTimerId);
        isOnPlatform = false;
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + "px";
            if (doodlerBottomSpace > 350) {
                fall();
            }
        }, 30);
    }

    function fall() {
        // Hace que el personaje caiga
        clearInterval(upTimerId);
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + "px";

            isOnPlatform = false;
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    (doodlerLeftSpace + 60 >= platform.left) &&
                    (doodlerLeftSpace <= platform.left + 85)
                ) {
                    isOnPlatform = true;
                    jump();
                }
            });

            if (doodlerBottomSpace <= 0) {
                // Si el personaje cae abajo, el juego puede reiniciarse
            }
        }, 30);
    }

    function moveLeft() {
        // Mueve el personaje a la izquierda
        if (doodlerLeftSpace > 0) {
            doodlerLeftSpace -= 10;
            doodler.style.left = doodlerLeftSpace + "px";
        }
    }

    function moveRight() {
        // Mueve el personaje a la derecha
        if (doodlerLeftSpace < 340) {
            doodlerLeftSpace += 10;
            doodler.style.left = doodlerLeftSpace + "px";
        }
    }

    function start() {
        // Inicia el juego
        createDoodler();
        createPlatforms();
        setInterval(movePlatforms, 30);
        jump();
    }

    document.getElementById("leftBtn").addEventListener("click", moveLeft);
    document.getElementById("rightBtn").addEventListener("click", moveRight);
    document.getElementById("jumpBtn").addEventListener("click", jump);

    start();
});