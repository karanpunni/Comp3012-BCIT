export default class Clinic {
  clinic: any;
  city: string;
  queue: any = [];
  waittime: number = 0;

  constructor(name: any, city: string) {
    this.clinic = name;
    this.city = city;
  }

  enqueue(paitent: any) {
    this.queue.push(paitent);
    this.waittime += 15;
  }

  dequeue() {
    this.queue.shift();
    this.waittime -= 15;
  }

  size() {
    return this.queue.length;
  }
}
