import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { LiveRate } from '../model/liverate.model';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LiverateService {
  private baseUrl = 'http://localhost:8080/rate/stream/';
  eventSource: EventSource;
  constructor(private http: HttpClient, private zone: NgZone) {}

  getLiveRate(duration: string): Observable<LiveRate> {
    return Observable.create((observer) => {
      this.eventSource = new EventSource(`${this.baseUrl}${duration}`);

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          // console.log('liverate: ', event.data);
          observer.next(new LiveRate(JSON.parse(event.data)));
        });
      }
      this.eventSource.onerror = (error) => { 
        this.zone.run(() => {
          observer.error(error)
        })
      }
      // return () => this.eventSource.close();
    });
  }

  cancelStream(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}cancel/${id}`).pipe(timeout(10000));
  }

  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
