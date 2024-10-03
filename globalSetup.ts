import { exec } from 'child_process';
import { promisify } from 'util';

async function sleep(n) {
  return new Promise(resolve => setTimeout(resolve, n));
}

const execPromise = promisify(exec);

let serverProcess: any = null;
let teardownHappened = false;

export async function setup() {
  console.log("Setting up JSON server...");


  serverProcess = exec('npx json-server db.json');


  serverProcess.stdout.on('data', (data) => {
    console.log(data);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(data);
  });


  await sleep(1000);
  console.log('JSON server started');
}

export async function teardown() {
  if (teardownHappened) {
    throw new Error('teardown called twice');
  }
  teardownHappened = true;

  if (serverProcess) {
    console.log('Killing JSON server...');
    serverProcess.kill('SIGTERM');
  }
  await sleep(1000);
}
