class Game {
  #ctx;

  init() {
    this.#ctx = new Context();
    const field = document.querySelector(".field");
    this.#ctx.map = this.#generateMap();

    this.#renderMap(field);
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
      const x = randomInteger(0, this.#ctx.map[0].length - 1);
      const y = randomInteger(0, this.#ctx.map.length - 1);

      this.#setWall(width, height, x, y);
    }
  }

  #generateLines() {
    const lineCount = randomInteger(3, 5);
    for (let i = 0; i < lineCount; i++) {
      this.#setWall(
        this.#ctx.map[0].length,
        1,
        0,
        randomInteger(0, this.#ctx.map.length - 1)
      );
    }
  }

  #generateColumns() {
    const columnCount = randomInteger(3, 5);
    for (let i = 0; i < columnCount; i++) {
      this.#setWall(
        1,
        this.#ctx.map.length,
        randomInteger(0, this.#ctx.map[0].length - 1),
        0
      );
    }
  }

  #setWall(width, height, x, y) {
    for (let i = x; i < x + width && i < this.#ctx.map[0].length; i++) {
      for (let j = y; j < y + height && j < this.#ctx.map.length; j++) {
        this.#ctx.map[j][i] = { ...this.#ctx.map[j][i], isWall: false };
      }
    }
  }

  clear() {
    this.#ctx.map = null;
  }

  #renderMap(field) {
    field.style.width = 30 * this.#ctx.map[0].length + "px";
    field.style.height = 30 * this.#ctx.map.length + "px";

    this.#generateRooms();
    this.#generateLines();
    this.#generateColumns();

    for (let i = 0; i < this.#ctx.map.length; i++) {
      for (let j = 0; j < this.#ctx.map[0].length; j++) {
        const cell = document.createElement("div");
        cell.classList.add("tile");
        this.#ctx.map[i][j].isWall ? cell.classList.add("tileW") : null;
        cell.style.left = j * 30 + "px";
        cell.style.top = i * 30 + "px";

        field.appendChild(cell);
      }
    }

    this.#renderBonus(field, 2, "sword", "tileSW");
    this.#renderBonus(field, 10, "heal", "tileHP");
  }

  #renderBonus(field, bonusCount, type, bonusClass) {
    for (let i = 0; i < bonusCount; i++) {
      const [x, y] = this.#getRandomFreeCell();

      this.#ctx.bonusList = [...this.#ctx.bonusList, new Bonus(type, { x, y })];

      const bonus = document.createElement("div");
      bonus.classList.add("tile");
      bonus.classList.add(bonusClass);
      bonus.style.left = x * 30 + "px";
      bonus.style.top = y * 30 + "px";

      field.appendChild(bonus);
    }
  }

  #getRandomFreeCell() {
    const x = randomInteger(0, this.#ctx.map[0].length - 1);
    const y = randomInteger(0, this.#ctx.map.length - 1);

    if (this.#ctx.map[y][x].isWall) {
      return this.#getRandomFreeCell();
    }

    return [x, y];
  }
}

class Character {
  static character_count = 0;
  #type;
  #hp;
  #power;
  #position;
  #id;

  constructor(type, hp, power, position) {
    this.#type = type;
    this.#hp = hp;
    this.#power = power;
    this.#position = position;
    this.#id = ++Character.character_count;
  }

  move(x, y) {
    this.#position.x += x;
    this.#position.y += y;
  }

  die(ctx) {
    return ctx.removeCharacterById(this.#id);
  }

  attack(enemy, ctx) {
    if (enemy) {
      enemy.hp = enemy.hp - this.#power;
    }

    characterIndex = ctx.characterList.findIndex(
      (character) => (character.id = enemy.id)
    );

    ctx.characterList = [
      ...ctx.characterList.slice(0, characterIndex),
      enemy,
      ctx.characterList.slice(characterIndex + 1),
    ];
  }

  heal(ctx) {
    this.#hp += 20;

    characterIndex = ctx.characterList.findIndex(
      (character) => (character.id = this.id)
    );

    ctx.characterList = [
      ...ctx.characterList.slice(0, characterIndex),
      this,
      ctx.characterList.slice(characterIndex + 1),
    ];
  }

  /**
   * @param {number} value
   */
  set hp(value) {
    this.#hp = value;
    if (this.#hp <= 0) this.die();
  }

  get hp() {
    return this.#hp;
  }

  /**
   * @param {number} value
   */
  set power(value) {
    this.#power = value;
  }

  get hp() {
    return this.#power;
  }

  get id() {
    return this.#id;
  }

  get position() {
    return this.#position;
  }

  get type() {
    return this.#position;
  }
}

class Bonus {
  static bonusCount = 0;
  #type;
  #id;
  #position;

  constructor(type, position) {
    this.#type = type;
    this.#position = { x: position.x, y: position.y };
    this.#id = ++Bonus.bonusCount;
  }

  get type() {
    return this.#type;
  }

  get id() {
    return this.#id;
  }

  get position() {
    return this.#position;
  }
}

class Context {
  #bonusList = [];
  #characterList = [];
  #map;
  #instance;

  constructor() {
    if (this.#instance) return this.#instance;
    this.#instance = this;
  }

  get characterList() {
    return this.#characterList;
  }

  set characterList(newList) {
    this.#characterList = newList;
  }

  get bonusList() {
    return this.#bonusList;
  }

  set bonusList(newList) {
    this.#bonusList = newList;
  }

  get map() {
    return this.#map;
  }

  set map(newMap) {
    this.#map = newMap;
  }

  removeBonusById(id) {
    bonusIndex = this.#bonusList.findIndex((bonus) => bonus.id === id);
    this.#bonusList = [
      ...this.#bonusList.slice(0, bonusIndex),
      this.#bonusList.slice(bonusIndex + 1),
    ];
  }

  removeCharacterById(id) {
    characterIndex = this.#characterList.findIndex(
      (character) => character.id === id
    );
    this.#characterList = [
      ...this.#characterList.slice(0, characterIndex),
      this.#characterList.slice(characterIndex + 1),
    ];
  }
}

function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
