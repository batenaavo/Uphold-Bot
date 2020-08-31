import pg from 'pg';

const { Client } = pg;

const client = new Client({
    user: 'quim',
    host: 'localhost',
    database: 'upholddb',
    password: '',
    port: 5432,
})

client.connect()

//stores transaction information (currency, amount transfered, origin and destination card ID's) into the db
//and logs a description of the transaction
export default function storeTransaction(cur, amount, msg, onResult) {
    
    var origin, dest; //ficticious values that would represent the user's USD card ID and BTC card ID

    cur == 'USD' ? (origin = 'USD card ID', dest = 'BTC card ID') : (origin = 'BTC card ID', dest = 'USD card ID');

    client.query(`INSERT INTO btc_transactions (currency, amount, origin, destination) values ('${cur}', ${amount}, '${origin}', '${dest}')`, (err, res) => {
        if (res) {
            console.log(msg);
            onResult();
        }
        else { console.log(err); }
    });
};