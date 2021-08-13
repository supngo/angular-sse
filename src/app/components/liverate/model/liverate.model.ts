export class LiveRate {
  rate: number;
  name: string;
  service: string;
  primaryAct: number;
  timeStamp: string;
  id: string;

  constructor(jsonData) {
    Object.assign(this, jsonData);
  }
}