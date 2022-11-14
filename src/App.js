const { Console, Random } = require("@woowacourse/mission-utils");
const Lotto = require("./Lotto");

class App {
  static LENGTH_OF_LOTTO_NUMBER = 6;
  static PRIZE = [5000, 50000, 1500000, 30000000, 2000000000];

  play() {
    this.readLine("구입금액을 입력해주세요.", this.runLotto.bind(this));
  }

  readLine(message, callback) {
    Console.readLine(message, callback);
  }

  print(message) {
    Console.print(message);
  }

  runLotto(value) {
    const amountOfPaid = this.makePayment(value);
    const lottos = this.issueLotto(amountOfPaid / 1000);
    this.getWinner(lottos, amountOfPaid);
  }

  makePayment(value) {
    const money = value;

    if (money.match(/\D+/)) {
      throw new TypeError("[ERROR] 올바른 숫자값을 입력해주세요.");
    }

    if (money % 1000 !== 0) {
      this.print("1000원 단위로 입력해주세요.");
      this.makePayment();
      return;
    }

    const numberOfLotto = money / 1000;

    this.print(`${numberOfLotto}개를 구매했습니다.`);

    return money;
  }

  issueLotto(numberOfLotto) {
    const lottos = [];
    for (let i = 0; i < numberOfLotto; i++) {
      const lottoNumbers = this.generateLottoNumber();

      lottos.push(new Lotto(lottoNumbers));
    }

    this.printLottos(lottos);

    return lottos;
  }

  generateLottoNumber() {
    const numbers = Random.pickUniqueNumbersInRange(
      1,
      45,
      App.LENGTH_OF_LOTTO_NUMBER
    );

    if (numbers[0] < numbers[1]) return numbers;

    return numbers.sort();
  }

  printLottos(lottos) {
    for (let i = 0; i < lottos.length; i++) {
      lottos[i].printNumbers();
    }
  }

  getWinner(lottos, amountOfPaid) {
    this.readLine("당첨번호를 입력해주세요.", (value) => {
      this.getWinnerNumber(value, lottos, amountOfPaid);
    });
  }

  getWinnerNumber(value, lottos, amountOfPaid) {
    const winnerNumber = value.split(",").map((string) => parseInt(string, 10));

    if (winnerNumber.length !== App.LENGTH_OF_LOTTO_NUMBER) {
      this.print("6개의 번호를 입력해주세요.");
      this.getWinner(lottos, amountOfPaid);
      return;
    }

    this.readLine("보너스 번호를 입력해주세요.", (value) => {
      this.getBonusNumber(value, winnerNumber, lottos, amountOfPaid);
    });
  }

  getBonusNumber(bonusNumber, winnerNumber, lottos, amountOfPaid) {
    const winningDetails = this.getWinningDetails(
      lottos,
      winnerNumber,
      bonusNumber,
      amountOfPaid
    );
    this.showFinalResult(winningDetails, amountOfPaid);
    Console.close();
  }

  getWinningDetails(lottos, winnerNumber, bonusNumber) {
    const winningDetails = {
      threeMatches: 0,
      fourMatches: 0,
      fiveMatches: 0,
      fiveMatchesWithBonus: 0,
      sixMatches: 0,
    };

    for (let i = 0; i < lottos.length; i++) {
      const result = lottos[i].getComparisonResult(winnerNumber, bonusNumber);
      this.switchComparisonResult(result, winningDetails);
    }

    return winningDetails;
  }

  switchComparisonResult(comparisonResult, winningDetails) {
    if (comparisonResult.winnerCount === 3) winningDetails.threeMatches += 1;
    if (comparisonResult.winnerCount === 4) winningDetails.fourMatches += 1;
    if (comparisonResult.winnerCount === 5) winningDetails.fiveMatches += 1;
    if (comparisonResult.winnerCount === 5 && comparisonResult.bonusFlag)
      winningDetails.fiveMatchesWithBonus += 1;

    if (comparisonResult.winnerCount === 6) winningDetails.sixMatches += 1;
  }

  showFinalResult(winningDetails, amountOfPaid) {
    this.showWinningDetails(winningDetails);
    this.showEarningsRate(winningDetails, amountOfPaid);
  }

  showWinningDetails({
    threeMatches,
    fourMatches,
    fiveMatches,
    fiveMatchesWithBonus,
    sixMatches,
  }) {
    this.print("당첨통계\n");
    this.print("---\n");
    this.print(`3개 일치 (5,000원) - ${threeMatches}개\n`);
    this.print(`4개 일치 (50,000원) - ${fourMatches}개\n`);
    this.print(`5개 일치 (1,500,000원) - ${fiveMatches}개\n`);
    this.print(
      `5개 일치, 보너스 볼 일치 (30,000,000원) - ${fiveMatchesWithBonus}개\n`
    );
    this.print(`6개 일치 (2,000,000,000원) - ${sixMatches}개\n`);
  }

  showEarningsRate(winningDetails, amountOfPaid) {
    const earningsRate = this.caculateEarningsRate(
      winningDetails,
      amountOfPaid
    );

    this.print(`총 수익률은 ${earningsRate}%입니다.`);
  }

  caculateEarningsRate(winningDetails, amountOfPaid) {
    const totalEarnings = Object.values(winningDetails).reduce(
      (pre, cur, i) => {
        return pre + cur * App.PRIZE[i];
      },
      0
    );

    const earningsRate = (totalEarnings / amountOfPaid).toFixed(1);

    return earningsRate;
  }
}

new App().play();
module.exports = App;
