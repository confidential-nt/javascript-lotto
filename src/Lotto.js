const { Console, Random } = require("@woowacourse/mission-utils");

class Lotto {
  #numbers;

  constructor(numbers) {
    this.validate(numbers);
    this.#numbers = numbers;
  }

  validate(numbers) {
    if (numbers.length !== 6) {
      throw new Error("[ERROR] 로또 번호는 6개여야 합니다.");
    }
  }

  // TODO: 추가 기능 구현
  printNumbers() {
    const joinedNumbers = this.#numbers.join(", ");
    Console.print(`[${joinedNumbers}]\n`);
  }

  getComparisonResult(winnerNumber, bonusNumber) {
    const result = {
      winnerCount: 0,
      bonusFlag: false,
    };

    for (let i = 0; i < this.#numbers.length; i++) {
      if (this.#numbers.includes(winnerNumber[i])) result.winnerCount++;
      if (this.#numbers.includes(bonusNumber)) result.bonusFlag = true;
    }

    return result;
  }
}

module.exports = Lotto;
