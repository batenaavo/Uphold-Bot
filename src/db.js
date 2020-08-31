import pg from 'pg';
const { Client } = pg;

var isTableCreated = false;

const client = new Client({
    user: 'user',
    host: 'localhost',
    database: 'dbname',
    password: 'dbpwd',
    port: 5432,
})

client.connect()

//creates a transaction table in the database
//table contains transaction ID, timestamp of the transaction, currency to be moved, amount, origin card ID and destination card ID
export function createTransactionTable(){
    client.query(`create table if not exists btc_transactions(
		id serial primary key,
		date timestamp with time zone NOT NULL DEFAULT (clock_timestamp()),
		currency varchar not null,
		amount numeric (11,5) not null,
		origin varchar not null,
		destination varchar not null	
	);`, (err, res) => {
        if (res) {
            isTableCreated = true;
            console.log('Table btc_transactions created');
        }
        else { console.log(err); }
    });
}

//stores transaction information (currency, amount transfered, origin and destination card ID's) into the db
//and logs a description of the transaction
export default function storeTransaction(cur, amount, msg, onResult) {

    if(!isTableCreated) createTransactionTable();

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