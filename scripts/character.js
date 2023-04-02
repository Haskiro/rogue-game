class Character {
  static character_count = 0;
  #type;
  #hp;
  #power;
  #position;
  #id;

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
    return ctx.removeCharacterById(this.#id);
  }

  attack(enemy, ctx) {
    enemy.hp = enemy.hp - this.#power;

    if (enemy.hp <= 0) {
      enemy.die(ctx);
      return;
    }

    const characterIndex = ctx.characterList.findIndex(
      (character) => character.id === enemy.id
    );

    ctx.characterList = [
      ...ctx.characterList.slice(0, characterIndex),
      enemy,
      ...ctx.characterList.slice(characterIndex + 1),
    ];
  }

  heal(ctx) {
    this.#hp += 20;
    if (this.#hp > 100) this.#hp = 100;

    const characterIndex = ctx.characterList.findIndex(
      (character) => character.id === this.id
    );

    ctx.characterList = [
      ...ctx.characterList.slice(0, characterIndex),
      this,
      ...ctx.characterList.slice(characterIndex + 1),
    ];
  }

  increasePower(ctx) {
    this.#power += 10;

    const characterIndex = ctx.characterList.findIndex(
      (character) => character.id === this.id
    );

    ctx.characterList = [
      ...ctx.characterList.slice(0, characterIndex),
      this,
      ...ctx.characterList.slice(characterIndex + 1),
    ];
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
