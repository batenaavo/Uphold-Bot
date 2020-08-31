<h1 align="center">Uphold Bot</h1>

 A Node Js bot that uses the Uphold API to simulate moving money between BTC and USD, storing and accessing transaction data in a PostgreSQL database.

 ## Setup

 npm must be installed in order to be able to run the program and a PostgreSQL server must be running with a database.

 To configure the connection between the app and the database open the `db.js` file inside the `src` folder and change the following code to match the credentials of the database you will be using:

 ```js
const client = new Client({
    user: 'user',
    host: 'localhost',
    database: 'dbname',
    password: 'dbpwd',
    port: 5432
});
```

Save the file and the bot is ready to run.

To run the bot head to the project directory and type in the terminal the command `$ npm start`.

To stop the bot at any time type the interruption command `Ctrl+C`.





