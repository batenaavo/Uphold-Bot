import sendRequest from './rest.js';
import storeTransaction from './db.js';

const minProfit = 5; //threshold profit percentage necessary to perform a transaction

var buy = true; //indicates if we are buying or selling BTC
var ask; //ask value obtained from the API (at which we buy)
var bid; //bid value obtained from the API (at which we sell)

function performFirstTransaction() {
  sendRequest((statusCode, result) => {
    ask = result['ask'];
    storeTransaction('USD', ask, `\n\nInitializing with a move of ${ask} USD to 1 BTC`, () => { buy = !buy; });
  });
}

function performTransaction() {
  sendRequest((statusCode, result) => {
    var profit, tmp;
    if (buy){
      tmp = result['ask'];
      profit = ((bid - tmp) / tmp * 100).toFixed(3); 
      //if we are buying BTC the profit is calculated using the current ask value and the last bid value we sold at
    }
    else {
      tmp = result['bid'];
      profit = ((tmp - ask) / ask * 100).toFixed(3);
      //if we are selling BTC the profit is calculated using the current bid value and the last ask value we bought at
    }
    if (profit > minProfit && buy) {
      storeTransaction('USD', tmp, `Profit of ${profit}%. Moving ${ask} USD to BTC.`, () => { buy = !buy; ask = tmp;});
    }
    else if (profit > minProfit && !buy) {
      storeTransaction('BTC', 1, `Profit of ${profit}%. Moving 1 BTC to USD.`, () => { buy = !buy; bid = tmp;});
    }
    else console.log(`Profit of ${profit}%. No action performed.`)
  });
}

performFirstTransaction();
setInterval(performTransaction, 5000);

