import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { LiveRate } from './model/liverate.model';
import { LiverateService } from './service/liverate.service';

@Component({
  selector: 'app-liverate',
  templateUrl: './liverate.component.html',
  styleUrls: ['./liverate.component.css'],
})
export class LiverateComponent implements OnInit, OnDestroy {
  liverate: Observable<LiveRate>;
  rateSub: Subscription;
  countdownSub: Subscription;
  result: LiveRate;
  lockRate: number;
  countdownTime: number = 30;
  counter: number;
  duration: string;
  countdownString: string;
  
  constructor(private liverateService: LiverateService, private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.duration = this.route.snapshot.paramMap.get('duration') || '30';
    this.getLiveRate(this  .duration);
    // this.result = { name: 'Test', rate: 1.25, id: '123', service: 'test', primaryAct: 90, timeStamp: '2021' };
  }

  getLiveRate(duration: string) {
    this.rateSub = this.liverateService.getLiveRate(duration).subscribe({
      next: data => {
        this.result = data;
        if(this.result.name)
          console.log(this.result.name + " - " + this.result.rate + " - " + this.result.timeStamp);
      },
      error: err => {
        console.error(err);
      }
    });
  }

  startCountdown() {
    --this.counter;
    this.countdownString = '00:' + (this.counter > 9 ? this.counter : '0' + this.counter);
    if(this.counter === 0) {
      this.lockRate = undefined;
      this.countdownSub.unsubscribe();
    }
  }


  lockLiveRate() {
    this.countdownSub && this.countdownSub.unsubscribe();
    this.counter = 30;
    this.lockRate = this.result.rate;
    this.countdownString = '00:30';
    this.countdownSub = interval(1000)
    .subscribe(x => this.startCountdown());
  }

  @HostListener('window:beforeunload')
  onBrowserClose() {
    console.log('Close');
    this.cancelStream(this.result.id);
  }

  ngOnDestroy(): void {
    console.log('Destroy');
    this.cancelStream(this.result.id);
  }

  cancelStream(id: string) {
    this.rateSub && this.rateSub.unsubscribe();
    this.countdownSub && this.countdownSub.unsubscribe();
    this.liverateService.close();
    this.liverateService.cancelStream(id).subscribe();
  }
}
