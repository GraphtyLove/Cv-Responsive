// JEUX SNAKE

// Quand la page web S'AFFCIHE -> execute la fonction suivante.
window.onload = function() {
  const canvasWidth = 900;
  const canvasHeight = 600;
  const blockSize = 30; // taille des blocks
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const widthInBlocks = canvasWidth / blockSize;
  const heightInBlocks = canvasHeight / blockSize;
  const centreX = canvasWidth / 2;
  const centreY = canvasHeight / 2;
  let delay = 100; // 100 = 1000 milliseconde -> 1sec -> MODIFIE LA VITESSE
  let BeCodeSnake;
  let applee;
  let score;
  let timeOut;

  init();

  function init() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = '5px solid #62c4d2';
    canvas.style.margin = '50px auto';
    canvas.style.display = 'block';
    canvas.style.backgroundImage = "url('images/snake/background.jpg')";
    document.body.appendChild(canvas);
    launch();
    }
  function launch() {
      // RESTART
    BeCodeSnake = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], 'right');
    applee = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeOut);
    refreshCanvas();
    }

  function refreshCanvas() {
    BeCodeSnake.advance(); // fait avancer le serpent

    if (BeCodeSnake.checkCollision()) {
      // GAME OVER
      gameOver();
    } else {
      if (BeCodeSnake.isEatingApple(applee)) {
        // Quand le serpent mange la pomme:
        score += 1;
        BeCodeSnake.ateApple = true;

        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(BeCodeSnake));
        if(score % 5 == 0){
          speedUp();
        }
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      drawScore();
      BeCodeSnake.draw();
      applee.draw();

      timeOut = setTimeout(refreshCanvas, delay);
    }
  }

  function speedUp(){
    delay/= 1.5 ;
  }

  // GAME OVER
  function gameOver() {
    ctx.save();
    ctx.font = 'bold 70px sans-serif';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
  
    ctx.strokeText('Game Over', centreX, centreY - 235);
    ctx.fillText('Game Over', centreX, centreY - 235);
    ctx.font = 'bold 30px sans-serif';
    ctx.strokeText(
      'Appuyer sur la touche Espace pour rejouer',
      centreX,
      centreY - 110
    );
    ctx.fillText(
      'Appuyer sur la touche Espace pour rejouer',
      centreX,
      centreY - 110
    );
    ctx.strokeText(`Votre score est de :  ${score}`, centreX, centreY - 160);
    ctx.fillText(`Votre score est de :  ${score}`, centreX, centreY - 160);

    ctx.restore();
  }



  function drawScore() {
    ctx.save();
    ctx.font = 'bold 30px sans serif';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score : ${score}`, 20, 45);
    ctx.restore();
  }

  function drawBlock(ctx, position) {
    const x = position[0] * blockSize;
    const y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;

    this.draw = function() {
      ctx.save();
      ctx.fillStyle = '#43A440';
      for (let i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      }

      ctx.restore();
    };

    // fonction qui va faire avancer le serpent
    this.advance = function() {
      const nextPosition = this.body[0].slice();
      switch (this.direction) {
        case 'left':
          nextPosition[0] -= 1;
          break;
        case 'right':
          nextPosition[0] += 1;
          break;
        case 'down':
          nextPosition[1] += 1;
          break;
        case 'up':
          nextPosition[1] -= 1;
          break;

        default:
          throw 'Invalid Direction'; // permet d'afficher un message d'erreur si on ne rentre pas dans les conditions
      }

      this.body.unshift(nextPosition);

      if (!this.ateApple) this.body.pop();
      else this.ateApple = false;
    };

    this.setDirection = function(newDirection) {
      // directions autorisées :
      let allowedDirections;

      switch (this.direction) {
        // Si je vais à gauche ou a droite -> les directions permises seront en haut ou en bas
        case 'left':
        case 'right':
          allowedDirections = ['up', 'down'];
          break;

        // Si je vais en haut ou en bas -> les directions permises seront gauche ou droite
        case 'down':
        case 'up':
          allowedDirections = ['left', 'right'];
          break;
        default:
          throw 'Invalid direction';
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        // indexOf : si ma newDirection est ok pour allowedDirection -> j'aurai 0 ou 1, si la direction n'est pas permise, j'aurai -1
        this.direction = newDirection;
      }
    };

    this.checkCollision = function() {
      let wallCollision = false;
      let snakeCollision = false;
      const head = this.body[0];
      const rest = this.body.slice(1);
      const snakeX = head[0];
      const snakeY = head[1];
      const minX = 0;
      const minY = 0;
      const maxX = widthInBlocks - 1;
      const maxY = heightInBlocks - 1;
      const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
        wallCollision = true;
      }

      for (let i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
          snakeCollision = true;
        }
      }

      return wallCollision || snakeCollision;
    };
    this.isEatingApple = function(appleToEat) {
      const head = this.body[0];
      if (
        head[0] === appleToEat.position[0] &&
        head[1] === appleToEat.position[1]
      ) {
        return true;
      } else return false;
    };
  }

  // LA POMME
  function Apple(position) {
    this.position = position;
    this.draw = function() {
      const radius = blockSize / 2;
      const x = this.position[0] * blockSize + radius; // je défini la position x comme pour un rectangle, et j'ajoute le rayon pour que la pomme soit centrée
      const y = this.position[1] * blockSize + radius;
      ctx.save();
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();

      ctx.restore();
    };

    this.setNewPosition = function() {
      const newX = Math.round(Math.random() * (widthInBlocks - 1));
      const newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };
    this.isOnSnake = function(snakeToCheck) {
      let isOnSnake = false;

      for (let i = 0; i < snakeToCheck.body.length; i++) {
        if (
          this.position[0] === snakeToCheck.body[i][0] &&
          this.position[1] === snakeToCheck.body[i][1]
        ) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };
  }

  document.onkeydown = function handleKeyDown(e) {
    // TOUCHES CLAVIER
    const key = e.keyCode;
    let newDirection;
    switch (key) {
      case 37: // 37 = flèche gauche
        newDirection = 'left';
        break;
      case 38: // 38 = flèche du dessus
        newDirection = 'up';
        break;
      case 39: // 39 = flèche droite
        newDirection = 'right';
        break;
      case 40: // 40 = flèche du bas
        newDirection = 'down';
        break;
      case 32:
        launch();
        return;

      case 81: // 81 = Q
        newDirection = 'left';
        break;
      case 90: // 90 = Z
        newDirection = 'up';
        break;
      case 68: // 68 = d
        newDirection = 'right';
        break;
      case 83: // 83 = s
        newDirection = 'down';
        break;

      default:
        return;
    }
    BeCodeSnake.setDirection(newDirection);
  };
};
