class Game {
  map = [];

  init() {
    const field = document.querySelector(".field");
    this.map = this.generateMap();
    field.style.width = 30 * this.map[0].length + "px";
    field.style.height = 30 * this.map.length + "px";

    this.renderMap(field, this.map);
  }

  generateMap() {
    const width = randomInteger(15, 30);
    const height = randomInteger(10, 20);
    const map = [...new Array(height)].map(() =>
      new Array(width).fill({
        wall: true,
        bonus: null,
      })
    );

    return map;
  }

  clear() {
    this.map = null;
  }

  renderMap(field, map) {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        const cell = document.createElement("div");
        this.map[i][j].wall
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

  constructor(type, hp, power, position) {
    this.type = type;
    this.hp = hp;
    this.power = power;
    this.position = position;
    this.id = ++person_count;
  }

  move(x, y) {
    this.position.x += x;
    this.position.y += y;
  }

  die(personList) {
    return personList.filter((person) => person.id !== this.id);
  }

  attack(enemy) {
    if (enemy !== undefined) enemy.changeHp(-this.power);
  }

  heal() {
    this.changeHp(20);
  }

  changeHp(dif) {
    this.hp + dif;
    if (this.hp <= 0) this.die();
  }

  changePower(dif) {
    this.power + dif;
  }
}

function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
