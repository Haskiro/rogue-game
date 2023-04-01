class Game {
  ctx;

  init() {
    this.ctx = new Context();
    const field = document.querySelector(".field");
    this.ctx.map = this.#generateMap();

    this.#renderMap(field);
    window.addEventListener("keydown", (ev) => this.onKeyDown(ev));
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

  clear() {
    this.ctx.map = null;
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
  }

  #renderBonus(field, bonusCount, type, bonusClass) {
    for (let i = 0; i < bonusCount; i++) {
      const [x, y] = this.#getRandomFreeCell();

      const bonus = new Bonus(type, { x, y });
      this.ctx.bonusList = [...this.ctx.bonusList, bonus];

      const bonusNode = this.#createChild(x, y, bonusClass, bonus.id);

      field.appendChild(bonusNode);
    }
  }

  #renderCharacter(field, characterCount, type, characterClass, power) {
    for (let i = 0; i < characterCount; i++) {
      const [x, y] = this.#getRandomFreeCell();

      this.ctx.characterList = [
        ...this.ctx.characterList,
        new Character(type, power, { x, y }),
      ];

      const health = document.createElement("div");
      health.classList.add("health");
      health.style.width = "100%";

      const character = this.#createChild(x, y, characterClass);

      character.appendChild(health);
      field.appendChild(character);
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

  onKeyDown(ev) {
    if (ev.key !== "w" && ev.key !== "a" && ev.key !== "s" && ev.key !== "d") {
      return;
    }

    const hero = this.ctx.characterList.find(
      (character) => character.type === "hero"
    );
    const heroNode = document.querySelector(".tileP");

    switch (ev.key) {
      case "w":
        if (
          hero.position.y - 1 >= 0 &&
          !this.ctx.map[hero.position.y - 1][hero.position.x].isWall
        ) {
          hero.move(0, -1);
          this.#rerender(heroNode, "move", hero);
          this.#checkBonus(hero);
        }
        break;
      case "a":
        if (
          hero.position.x - 1 >= 0 &&
          !this.ctx.map[hero.position.y][hero.position.x - 1].isWall
        ) {
          hero.move(-1, 0);
          this.#rerender(heroNode, "move", hero);
          this.#checkBonus(hero);
        }
        break;
      case "s":
        if (
          hero.position.y + 1 < this.ctx.map.length &&
          !this.ctx.map[hero.position.y + 1][hero.position.x].isWall
        ) {
          hero.move(0, 1);
          this.#rerender(heroNode, "move", hero);
          this.#checkBonus(hero);
        }
        break;
      case "d":
        if (
          hero.position.x + 1 < this.ctx.map[0].length &&
          !this.ctx.map[hero.position.y][hero.position.x + 1].isWall
        ) {
          hero.move(1, 0);
          this.#rerender(heroNode, "move", hero);
          this.#checkBonus(hero);
        }
        break;
      default:
        break;
    }
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
          this.#rerender(heroNode, "heal", hero);
          break;

        case "sword":
          hero.increasePower(this.ctx);
          break;

        default:
          break;
      }

      this.ctx.removeBonusById(bonus.id);
      this.#rerender(document.getElementById(bonus.id), "delete");
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
      case "heal":
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
