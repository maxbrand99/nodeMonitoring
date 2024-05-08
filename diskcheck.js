const si = require('systeminformation');

async function systemCheck() {
  let cpu = await si.cpu();
  console.log(cpu);

  let load = await si.currentLoad();
  console.log(load);

  let disk = await si.diskLayout();
  console.log(disk);

  let fs = await si.fsSize();
  let diskUse = fs[0].use;
  console.log(fs[0].use);

  let memStats = await si.mem();
  let percentAvailable = Math.floor(memStats.available / memStats.total * 100);
  console.log(percentAvailable);
  return [diskUse, percentAvailable];
}

systemCheck();
