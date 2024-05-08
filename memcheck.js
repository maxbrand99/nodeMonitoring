const si = require('systeminformation');

async function systemCheck() {
  let cpu = await si.cpu();
  //console.log(cpu);

  let load = await si.currentLoad();
  //console.log(load);

  let disk = await si.diskLayout();
  //console.log(disk);

  let fs = await si.fsSize();
  let diskUse = fs[0].use;
  console.log("Disk use percent use: ", fs[0].use);
  if (diskUse > 75) {
    console.log("Disk use is getting dangerously high.");
  }

  let memStats = await si.mem();
  let percentAvailable = Math.floor(memStats.available / memStats.total * 100);
  if (percentAvailable < 20) {
    console.log("Memory is getting low.");
  }
  console.log(`Memory percent free: ${percentAvailable}`);
}

const tenMinutes = 10 * 60 * 1000;
const oneMinute = 60 * 1000;
const oneHour = 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * 24 * 60 * 60 * 1000;

systemCheck();
