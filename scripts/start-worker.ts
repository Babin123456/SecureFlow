import { worker } from '../src/lib/queue/worker';

worker.on('ready', () => {
  console.log('🚀 BullMQ Worker successfully initialized and waiting for jobs...');
});

worker.on('error', (err) => {
  console.error('❌ BullMQ Worker Error:', err);
});
