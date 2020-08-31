import sendRequest from './rest.js';
import storeTransaction from './db.js';

var buy = true; //indicates if we are buying or selling BTC
var ask; //ask value obtained from the API (at which we buy)
var bid; //bid value obtained from the API (at which we sell)

function performFirstTransaction() {
  sendRequest((statusCode, result) => {
    ask = result['ask'];
    storeTransaction('USD', ask, `Initializing with 1 BTC at ${ask} USD`, () => { buy = !buy; });
  });
}

function performTransaction() {
  sendRequest((statusCode, result) => {
    var profit, tmp;
    if (buy)
      profit = ((bid - result['ask']) / 100).toFixed(2); 
      //if we are buying BTC the profit is calculated using the current ask value and the last bid value we sold at
    else 
      profit = ((result['bid'] - ask) / 100).toFixed(2);
      //if we are selling BTC the profit is calculated using the current bid value and the last ask value we bought at
    if (profit > 5 && buy) {
      tmp = result['ask'];
      storeTransaction('USD', tmp, `Profit of ${profit}%. Moving ${ask} USD to BTC.`, () => { buy = !buy; ask = tmp;});
    }
    else if (profit > 5 && !buy) {
      tmp = result['bid'];
      storeTransaction('BTC', 1, `Profit of ${profit}%. Moving 1 BTC to USD.`, () => { buy = !buy; bid = tmp;});
    }
    else console.log(`Profit of ${profit}%. No action performed.`)
  });
}

performFirstTransaction();
setInterval(performTransaction, 5000);

