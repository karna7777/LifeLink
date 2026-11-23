import api from './api';
import { getQueue, setQueue } from './storage';

// Add an action to the offline queue, to be sent when back online.
// item = { type: 'message' | 'request', payload }
export async function enqueue(item) {
  const queue = await getQueue();
  queue.push(item);
  await setQueue(queue);
}

// Try to send everything in the queue, in order. Keep any that still fail.
export async function processQueue() {
  const queue = await getQueue();
  if (queue.length === 0) return;

  const remaining = [];
  for (const item of queue) {
    try {
      if (item.type === 'message') {
        await api.post('/messages/' + item.payload.requestId, { text: item.payload.text });
      } else if (item.type === 'request') {
        await api.post('/requests', item.payload);
      }
    } catch (err) {
      remaining.push(item); // still offline / failed — try again next time
    }
  }
  await setQueue(remaining);
}
