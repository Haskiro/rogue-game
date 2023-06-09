class Game {
  ctx;

  init() {
    this.ctx = new Context();
    const field = document.querySelector(".field");
    this.ctx.map = this.#generateMap();

    this.#renderMap(field);
    window.addEventListener("keydown", this.onKeyDown);
  }

  #generateMap() {
    const width = randomInteger(20, 30);
    const height = randomInteger(14, 20);
    const map = [...new Array(height)].map(() =>
      new Array(width).fill({
        isWall: true,
      })
    );

    return map;
  }

  #generateRooms() {
    const roomsCount = randomInteger(5, 10);
    for (let i = 0; i < roomsCount; i++) {
      const width = randomInteger(3, 8);
      const height = randomInteger(3, 8);
      const x = randomInteger(0, this.ctx.map[0].length - 1);
      const y = randomInteger(0, this.ctx.map.length - 1);

      this.#setWall(width, height, x, y);
    }
  }

  #generateLines() {
    const lineCount = randomInteger(3, 5);
    for (let i = 0; i < lineCount; i++) {
      this.#setWall(
        this.ctx.map[0].length,
        1,
        0,
        randomInteger(0, this.ctx.map.length - 1)
      );
    }
  }

  #generateColumns() {
    const columnCount = randomInteger(3, 5);
    for (let i = 0; i < columnCount; i++) {
      this.#setWall(
        1,
        this.ctx.map.length,
        randomInteger(0, this.ctx.map[0].length - 1),
        0
      );
    }
  }

  #setWall(width, height, x, y) {
    for (let i = x; i < x + width && i < this.ctx.map[0].length; i++) {
      for (let j = y; j < y + height && j < this.ctx.map.length; j++) {
        this.ctx.map[j][i] = { ...this.ctx.map[j][i], isWall: false };
      }
    }
  }

  clear(result) {
    this.ctx.characterList.forEach((character) => character.die(this.ctx));
    this.ctx = undefined;
    const field = document.querySelector(".field");
    while (field.hasChildNodes()) {
      field.removeChild(field.lastChild);
    }

    const resultNode = document.createElement("div");
    resultNode.classList.add("result");
    result === "win"
      ? (resultNode.textContent = "Победа!")
      : (resultNode.textContent = "Смерть.");

    field.appendChild(resultNode);

    window.removeEventListener("keydown", this.onKeyDown);
  }

  #renderMap(field) {
    field.style.width = 30 * this.ctx.map[0].length + "px";
    field.style.height = 30 * this.ctx.map.length + "px";

    this.#generateRooms();
    this.#generateLines();
    this.#generateColumns();

    for (let i = 0; i < this.ctx.map.length; i++) {
      for (let j = 0; j < this.ctx.map[0].length; j++) {
        let cell;

        if (this.ctx.map[i][j].isWall) {
          cell = this.#createChild(j, i, "tileW");
        } else {
          cell = this.#createChild(j, i);
        }

        field.appendChild(cell);
      }
    }

    this.#renderBonus(field, 2, "sword", "tileSW");
    this.#renderBonus(field, 10, "heal", "tileHP");
    this.#renderCharacter(field, 1, "hero", "tileP", 20);
    this.#renderCharacter(field, 10, "enemy", "tileE", 10);
    this.#moveEnemies();
  }

  #renderBonus(field, bonusCount, type, bonusClass) {
    for (let i = 0; i < bonusCount; i++) {
      const [x, y] = this.#getRandomFreeCell();

      const bonus = new Bonus(type, { x, y });
      this.ctx.bonusList = [...this.ctx.bonusList, bonus];

      const bonusNode = this.#createChild(x, y, bonusClass, "bonus" + bonus.id);

      field.appendChild(bonusNode);
    }
  }

  #renderCharacter(field, characterCount, type, characterClass, power) {
    for (let i = 0; i < characterCount; i++) {
      const [x, y] = this.#getRandomFreeCell();

      const character = new Character(type, power, { x, y });
      this.ctx.characterList = [...this.ctx.characterList, character];

      const health = document.createElement("div");
      health.classList.add("health");
      health.style.width = "100%";

      const characterNode = this.#createChild(
        x,
        y,
        characterClass,
        "character" + character.id
      );

      characterNode.appendChild(health);
      field.appendChild(characterNode);
    }
  }

  #createChild(x, y, className = null, id = null) {
    const child = document.createElement("div");
    child.classList.add("tile");
    if (className) child.classList.add(className);
    if (id) child.setAttribute("id", id);
    child.style.left = x * 30 + "px";
    child.style.top = y * 30 + "px";

    return child;
  }

  #getRandomFreeCell() {
    const x = randomInteger(0, this.ctx.map[0].length - 1);
    const y = randomInteger(0, this.ctx.map.length - 1);

    if (
      this.ctx.map[y][x].isWall ||
      this.ctx.bonusList.some(
        (bonus) => bonus.position.x === x && bonus.position.y === y
      ) ||
      this.ctx.characterList.some(
        (character) => character.position.x === x && character.position.y === y
      )
    ) {
      return this.#getRandomFreeCell();
    }

    return [x, y];
  }

  #moveEnemies() {
    this.ctx.characterList.forEach((character) => {
      if (character.type === "hero") return;
      let way = this.#generateRandomAxis(character);
      const enemyNode = document.getElementById("character" + character.id);
      const hero = this.ctx.characterList.find(
        (character) => character.type === "hero"
      );

      const interval = setInterval(() => {
        const x = character.position.x;
        const y = character.position.y;
        let newX;
        let newY;

        switch (way) {
          case 1:
            if (
              y - 1 < 0 ||
              this.ctx.map[y - 1][x].isWall ||
              (y - 1 === hero.position.y && x === hero.position.x)
            ) {
              newY = y + 1;
              newX = x;
              way = 3;
            } else {
              newY = y - 1;
              newX = x;
            }
            character.position = {
              x: newX,
              y: newY,
            };
            break;

          case 2:
            if (
              x - 1 < 0 ||
              this.ctx.map[y][x - 1].isWall ||
              (y === hero.position.y && x - 1 === hero.position.x)
            ) {
              newY = y;
              newX = x + 1;
              way = 4;
            } else {
              newY = y;
              newX = x - 1;
            }
            character.position = {
              x: newX,
              y: newY,
            };
            break;

          case 3:
            if (
              y + 1 >= this.ctx.map.length ||
              this.ctx.map[y + 1][x].isWall ||
              (y + 1 === hero.position.y && x === hero.position.x)
            ) {
              newY = y - 1;
              newX = x;
              way = 1;
            } else {
              newY = y + 1;
              newX = x;
            }
            character.position = {
              x: newX,
              y: newY,
            };
            break;

          case 4:
            if (
              x + 1 >= this.ctx.map[0].length ||
              this.ctx.map[y][x + 1].isWall ||
              (y === hero.position.y && x + 1 === hero.position.x)
            ) {
              newY = y;
              newX = x - 1;
              way = 2;
            } else {
              newY = y;
              newX = x + 1;
            }
            character.position = {
              x: newX,
              y: newY,
            };
            break;

          default:
            break;
        }

        character.movingInterval = interval;

        this.ctx.updateCharacter(character);
        this.#rerender(enemyNode, "move", character);
        const enemies = this.#findEnemies(character, "enemy");
        this.#handleAttack(character, enemies, "hero");
      }, 300);
    });
  }

  #handleAttack(character, enemies, characterType = "enemy") {
    enemies.forEach((enemy) => {
      character.attack(enemy, this.ctx);
      const enemyNode = document.getElementById("character" + enemy.id);
      if (enemy.hp <= 0) {
        if (characterType === "hero") {
          this.clear("loose");
        } else {
          if (this.ctx.characterList.length < 2) {
            this.clear("win");
          }
        }
        this.#rerender(enemyNode, "delete");
      } else {
        this.#rerender(enemyNode, "health", enemy);
      }
    });
  }

  #generateRandomAxis(enemy) {
    const way = randomInteger(1, 4);
    let cell;
    const x = enemy.position.x;
    const y = enemy.position.y;

    switch (way) {
      case 1:
        if (y - 1 >= 0) cell = this.ctx.map[y - 1][x];

        break;

      case 2:
        if (x - 1 >= 0) cell = this.ctx.map[y][x - 1];
        break;

      case 3:
        if (y + 1 < this.ctx.map.length) cell = this.ctx.map[y + 1][x];
        break;

      case 4:
        if (x + 1 < this.ctx.map[0].length) cell = this.ctx.map[y][x + 1];
        break;

      default:
        break;
    }

    if (!cell || cell.isWall) {
      return this.#generateRandomAxis(enemy);
    }

    return way;
  }

  onKeyDown = (ev) => {
    if (
      ev.code !== "KeyW" &&
      ev.code !== "KeyA" &&
      ev.code !== "KeyS" &&
      ev.code !== "KeyD" &&
      ev.code !== "Space"
    ) {
      return;
    }

    const hero = this.ctx.characterList.find(
      (character) => character.type === "hero"
    );
    const heroNode = document.querySelector(".tileP");

    switch (ev.code) {
      case "KeyW":
        if (
          hero.position.y - 1 >= 0 &&
          !this.ctx.map[hero.position.y - 1][hero.position.x].isWall &&
          !this.ctx.characterList.some(
            (character) =>
              character.position.x === hero.position.x &&
              character.position.y === hero.position.y - 1
          )
        ) {
          hero.move(0, -1);
          this.#rerender(heroNode, "move", hero);
          this.#checkBonus(hero);
        }
        break;
      case "KeyA":
        if (
          hero.position.x - 1 >= 0 &&
          !this.ctx.map[hero.position.y][hero.position.x - 1].isWall &&
          !this.ctx.characterList.some(
            (character) =>
              character.position.x === hero.position.x - 1 &&
              character.position.y === hero.position.y
          )
        ) {
          hero.move(-1, 0);
          this.#rerender(heroNode, "move", hero);
          this.#checkBonus(hero);
        }
        break;

      case "KeyS":
        if (
          hero.position.y + 1 < this.ctx.map.length &&
          !this.ctx.map[hero.position.y + 1][hero.position.x].isWall &&
          !this.ctx.characterList.some(
            (character) =>
              character.position.x === hero.position.x &&
              character.position.y === hero.position.y + 1
          )
        ) {
          hero.move(0, 1);
          this.#rerender(heroNode, "move", hero);
          this.#checkBonus(hero);
        }
        break;

      case "KeyD":
        if (
          hero.position.x + 1 < this.ctx.map[0].length &&
          !this.ctx.map[hero.position.y][hero.position.x + 1].isWall &&
          !this.ctx.characterList.some(
            (character) =>
              character.position.x === hero.position.x + 1 &&
              character.position.y === hero.position.y
          )
        ) {
          hero.move(1, 0);
          this.#rerender(heroNode, "move", hero);
          this.#checkBonus(hero);
        }
        break;

      case "Space":
        const enemies = this.#findEnemies(hero, "hero");
        this.#handleAttack(hero, enemies);

        break;

      default:
        break;
    }
  };

  #findEnemies(character, type) {
    const x = character.position.x;
    const y = character.position.y;

    let result = [];

    switch (type) {
      case "hero":
        result.push(
          this.ctx.characterList.find(
            (character) =>
              character.position.x === x + 1 && character.position.y === y
          )
        );
        result.push(
          this.ctx.characterList.find(
            (character) =>
              character.position.x === x && character.position.y === y + 1
          )
        );
        result.push(
          this.ctx.characterList.find(
            (character) =>
              character.position.x === x - 1 && character.position.y === y
          )
        );
        result.push(
          this.ctx.characterList.find(
            (character) =>
              character.position.x === x && character.position.y === y - 1
          )
        );
        break;

      case "enemy":
        const hero = this.ctx.characterList.find(
          (character) => character.type === "hero"
        );

        if (
          (x + 1 === hero.position.x && y === hero.position.y) ||
          (x - 1 === hero.position.x && y === hero.position.y) ||
          (x === hero.position.x && y + 1 === hero.position.y) ||
          (x === hero.position.x && y - 1 === hero.position.y)
        ) {
          result.push(hero);
        }
        break;
    }

    result = result.filter(Boolean);

    return result;
  }

  #checkBonus(hero) {
    const bonus = this.ctx.bonusList.find((bonus) => {
      return (
        bonus.position.x === hero.position.x &&
        bonus.position.y === hero.position.y
      );
    });

    if (bonus) {
      const heroNode = document.querySelector(".tileP");
      switch (bonus.type) {
        case "heal":
          hero.heal(this.ctx);
          this.#rerender(heroNode, "health", hero);
          break;

        case "sword":
          hero.increasePower(this.ctx);
          break;

        default:
          break;
      }

      this.ctx.removeBonusById(bonus.id);
      this.#rerender(document.getElementById("bonus" + bonus.id), "delete");
    }
  }

  #rerender(node, action, obj = null) {
    switch (action) {
      case "move":
        node.style.left = 30 * obj.position.x + "px";
        node.style.top = 30 * obj.position.y + "px";
        break;
      case "delete":
        node.remove();
        break;
      case "health":
        node.firstElementChild.style.width = obj.hp + "%";
        break;
      default:
        break;
    }
  }
}

function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
