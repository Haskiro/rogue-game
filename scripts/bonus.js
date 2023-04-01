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
