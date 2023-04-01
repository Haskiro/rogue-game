class Game {
  #map = [];

  init() {
    const field = document.querySelector(".field");
    this.#map = this.#generateMap();

    this.#renderMap(field);
  }

  #generateMap() {
    const width = randomInteger(20, 30);
    const height = randomInteger(14, 20);
    const map = [...new Array(height)].map(() =>
      new Array(width).fill({
        isWall: true,
        bonus: null,
        personId: null,
      })
    );

    return map;
  }

  #generateRooms() {
    const roomsCount = randomInteger(5, 10);
    for (let i = 0; i < roomsCount; i++) {
      const width = randomInteger(3, 8);
      const height = randomInteger(3, 8);
      const x = randomInteger(0, this.#map[0].length - 1);
      const y = randomInteger(0, this.#map.length - 1);

      this.#setWall(width, height, x, y);
    }
  }

  #generateLines() {
    const lineCount = randomInteger(3, 5);
    for (let i = 0; i < lineCount; i++) {
      this.#setWall(
        this.#map[0].length,
        1,
        0,
        randomInteger(0, this.#map.length - 1)
      );
    }
  }

  #generateColumns() {
    const columnCount = randomInteger(3, 5);
    for (let i = 0; i < columnCount; i++) {
      this.#setWall(
        1,
        this.#map.length,
        randomInteger(0, this.#map[0].length - 1),
        0
      );
    }
  }

  #setWall(width, height, x, y) {
    for (let i = x; i < x + width && i < this.#map[0].length; i++) {
      for (let j = y; j < y + height && j < this.#map.length; j++) {
        this.#map[j][i] = { ...this.#map[j][i], isWall: false };
      }
    }
  }

  clear() {
    this.#map = null;
  }

  #renderMap(field) {
    field.style.width = 30 * this.#map[0].length + "px";
    field.style.height = 30 * this.#map.length + "px";

    this.#generateRooms();
    this.#generateLines();
    this.#generateColumns();

    for (let i = 0; i < this.#map.length; i++) {
      for (let j = 0; j < this.#map[0].length; j++) {
        const cell = document.createElement("div");
        this.#map[i][j].isWall
          ? cell.classList.add("tileW")
          : cell.classList.add("tile");
        cell.style.left = j * 30 + "px";
        cell.style.top = i * 30 + "px";

        field.appendChild(cell);
      }
    }
  }
}

class Person {
  static person_count = 0;
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
    this.#id = ++person_count;
  }

  move(x, y) {
    this.#position.x += x;
    this.#position.y += y;
  }

  die(ctx) {
    return ctx.removePersonById(this.#id);
  }

  attack(enemy, ctx) {
    if (enemy) {
      enemy.hp(enemy.hp - this.#power);
    }

    personIndex = ctx.personList.findIndex((person) => (person.id = enemy.id));

    ctx.personList([
      ...ctx.personList.slice(0, personIndex),
      enemy,
      ctx.personList.slice(personIndex + 1),
    ]);
  }

  heal(ctx) {
    this.#hp += 20;

    personIndex = ctx.personList.findIndex((person) => (person.id = this.id));

    ctx.personList([
      ...ctx.personList.slice(0, personIndex),
      this,
      ctx.personList.slice(personIndex + 1),
    ]);
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

  constructor(type) {
    this.#type = type;
    this.#id = ++bonusCount;
  }

  get type() {
    return this.#type;
  }

  get id() {
    return this.#id;
  }
}

class Context {
  #bonusList;
  #personList;
  #instance;

  constructor() {
    if (this.#instance) return this.#instance;
  }

  get personList() {
    return this.#bonusList;
  }

  set personList(newList) {
    this.#bonusList = newList;
  }

  get bonusList() {
    return this.#personList;
  }

  set bonusList(newList) {
    this.#bonusList = newList;
  }

  removeBonusById(id) {
    bonusIndex = this.#bonusList.findIndex((bonus) => bonus.id === id);
    this.#bonusList = [
      ...this.#bonusList.slice(0, bonusIndex),
      this.#bonusList.slice(bonusIndex + 1),
    ];
  }

  removePersonById(id) {
    personIndex = this.#personList.findIndex((person) => person.id === id);
    this.#personList = [
      ...this.#personList.slice(0, personIndex),
      this.#personList.slice(personIndex + 1),
    ];
  }
}

function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
