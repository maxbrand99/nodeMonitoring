const https = require('https');
const http = require('http');
const net = require('net');
const si = require('systeminformation');
const { Client } = require('pg')
var twillio = require('twilio')('TODO', 'TODO'); //TODO: add api keys, will get exact name soon

// TODO: replace with your phone numbers, min of 1, no maximum
let oncall = [
  "15555555555", //format is country-code and then phone number
  "phone number 2",
  "phone number 3",
];

async function notify(msg, line) {
  return new Promise((resolve, reject) => {
    try {
      twillio.messages.create({
        to: '+' + line, // Any number Twilio can deliver to
        messagingServiceSid: 'TODO', //TODO: replace with your messagingServiceSid
        body: 'AxieChatNode: ' + msg // body of the SMS message
      }).then(message => console.log(message.sid))
        .done(() => {
          console.log("Done sending through twilio.");
          resolve("Done sending.");
        });
    } catch (ex) {
      console.log("Error sending through twilio: ", ex);
      resolve();
    }
  });
}

async function notifyOnCall(msg) {
  console.log("Notifying oncall: ", msg, oncall.length);
  setTimeout(() => {
    for (let i = 0; i < oncall.length; i++) {
      setTimeout(async () => {
        console.log("Sending notification: ", oncall[i], Date.now());
        await notify(msg, oncall[i]);
      }, i * 1100);
    }
  }, 1000);
}

// This function is a normal up check that should send out a 
async function alive() {
  let diskUse, percentAvailable;
  [diskUse, percentAvailable] = await systemCheck();
  await notifyOnCall(`Hello from Axie Node!  Disk use: ${diskUse}% Mem Avail: ${percentAvailable}% for ${new Date()}`);
}

async function dbCheck() {
  try {
    // TODO: if you use custom DB info in your ronin .env file, update it here
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'bridge',
      password: 'postgres',
      port: 5432,
    })

    await client.connect()

    const res = await client.query('select count(*) from task where status=\'failed\'');

    let row = res.rows[0];
    if (row.fail > 100) {
      notifyOnCall(`AxieChat Node Database has ${row.fail} failures: ` + new Date());
    } else {
      console.log(`AxieChat Node Database status ${JSON.stringify(row, null, 2)}`);
    }

    await client.end()
  } catch (ex) {
    notifyOnCall(`AxieChat Node Database has failed to work on db: ` + new Date());
    console.log(ex);
  }
}

async function isPortReachable(port, host, timeout = 1000) {
  return new Promise(((resolve, reject) => {
    try {
      const socket = new net.Socket();

      const onError = () => {
        socket.destroy();
        resolve(false);
      };

      socket.setTimeout(timeout);
      socket.once('error', onError);
      socket.once('timeout', onError);

      socket.connect(port, host, () => {
        socket.end();
        resolve(true);
      });
    } catch (ex) {
      reject("Socket attempts failed:", port, host);
    }
  }));
}

async function portCheck() {
  let portList = [6060, 8545, 8546, 30303, 5432];

  for (let i = 0; i < portList.length; i++) {
    if (!await isPortReachable(portList[i], "localhost")) {
      console.log("WTF: ", portList, portList[i], i, typeof portList[i]);
      notifyOnCall("Can't reach ronin node port: " + portList[i]);
    }
  }
}

async function systemCheck() {
  let cpu = await si.cpu();
  //console.log(cpu);

  let load = await si.currentLoad();
  //console.log(load);

  let disk = await si.diskLayout();
  //console.log(disk);

  let fs = await si.fsSize();
  let diskUse = fs[0].use;
  console.log(fs[0].use);
  if (diskUse > 75) {
    notifyOnCall("Disk use is getting dangerously high.");
  }

  let memStats = await si.mem();
  let percentAvailable = Math.floor(memStats.available / memStats.total * 100);
  if (percentAvailable < 20) {
    console.log(`Memory percent free: ${percentAvailable}`);
    notifyOnCall("Memory is getting low.");
  }

  return [diskUse, percentAvailable];
}

const requestListener = function (req, res) {
  console.log("Request: " + req.url);
  notifyOnCall(`AxieChat Node Login By: ` + req.url.replace(/.*login=/, ""));
  res.writeHead(200);
  res.end(``);
}

const tenMinutes = 10 * 60 * 1000;
const oneMinute = 60 * 1000;
const oneHour = 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * 24 * 60 * 60 * 1000;

const server = http.createServer(requestListener);
server.listen(8080);

setInterval(systemCheck, tenMinutes);
systemCheck();

// Calculate the time until the desired execution time
const now = new Date();
const desiredTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0); // 6:00 PM GMT
const delay = desiredTime - now;

setTimeout(() => {
  setInterval(alive, oneDay);
}, delay);

alive();
setInterval(dbCheck, tenMinutes);
dbCheck();
setInterval(portCheck, oneMinute);
portCheck();
