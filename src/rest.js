import http from 'http';
import https from 'https';

//here is the Uphold API ticker endpoint
const options = { 
  host: 'api.uphold.com',
  port: 443,
  path: '/v0/ticker/BTC-USD',
  method: 'GET'
};

//responsible for sending requests with a customizable onResult callback
export default function sendRequest(onResult) {
  const port = options.port == 443 ? https : http;

  let output = '';

  const req = port.request(options, (res) => {
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      output += chunk;
    });

    res.on('end', () => {
      let obj = JSON.parse(output);

      onResult(res.statusCode, obj);
    });
  });

  req.on('error', (err) => {
    console.log(err.message);
  });

  req.end();
};