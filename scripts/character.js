class Character {
  static character_count = 0;
  #type;
  #hp;
  #power;
  #position;
  #id;
  #movingInterval;

  constructor(type, power, position) {
    this.#type = type;
    this.#power = power;
    this.#position = position;
    this.#id = ++Character.character_count;
    this.#hp = 100;
  }

  move(x, y) {
    this.#position.x += x;
    this.#position.y += y;
  }

  die(ctx) {
    clearInterval(this.#movingInterval);
    ctx.removeCharacterById(this.#id);
  }

  attack(enemy, ctx) {
    enemy.hp = enemy.hp - this.#power;

    if (enemy.hp <= 0) {
      enemy.die(ctx);
      return;
    }

    ctx.updateCharacter(enemy);
  }

  heal(ctx) {
    this.#hp += 20;
    if (this.#hp > 100) this.#hp = 100;

    ctx.updateCharacter(this);
  }

  increasePower(ctx) {
    this.#power += 10;

    ctx.updateCharacter(this);
  }

  /**
   * @param {number} value
   */
  set hp(value) {
    this.#hp = value;
  }

  get hp() {
    return this.#hp;
  }

  set movingInterval(value) {
    this.#movingInterval = value;
  }

  get movingInterval() {
    return this.#movingInterval;
  }

  /**
   * @param {number} value
   */
  set power(value) {
    this.#power = value;
  }

  get power() {
    return this.#power;
  }

  get id() {
    return this.#id;
  }

  get position() {
    return this.#position;
  }

  set position(newPosition) {
    this.#position = newPosition;
  }

  get type() {
    return this.#type;
  }
}
