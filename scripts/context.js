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
    const bonusIndex = this.#bonusList.findIndex((bonus) => bonus.id === id);
    this.#bonusList = [
      ...this.#bonusList.slice(0, bonusIndex),
      ...this.#bonusList.slice(bonusIndex + 1),
    ];
  }

  removeCharacterById(id) {
    const characterIndex = this.#characterList.findIndex(
      (character) => character.id === id
    );
    this.#characterList = [
      ...this.#characterList.slice(0, characterIndex),
      ...this.#characterList.slice(characterIndex + 1),
    ];
  }
}
