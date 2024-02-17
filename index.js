const { Worker } = require('worker_threads');
const { performance } = require('perf_hooks');

function chunkify(array, n) {
  const chunks = [];
  for (let i = n; i > 0; i--) {
    chunks.push(array.splice(0, Math.ceil(array.length / i)));
  }

  return chunks;
}

const t1 = performance.now();
let completed = 0;

function run(jobs, n) {
  console.log(`Starting ${n} jobs`)

  const chunks = chunkify(jobs, n);
  
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Starting worker ${i}`);
    const data = chunks[i];
    const worker = new Worker('./worker.js');
    
    worker.postMessage(data);
    worker.on("message", () => {
      console.log(`Worker ${i} completed`);
      completed++;

      if (completed === n) {
        const t2 = performance.now();

        console.log(`${n} worker finished ${t2 - t1} ms`);
        process.exit(0);
      }
    });
  }
}

const jobs = Array.from({ length: 100 }, () => 1e9);

run(jobs, 12);
