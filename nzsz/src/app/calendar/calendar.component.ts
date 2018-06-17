import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  CalendarTable: DayInfo[][] = [];

  constructor() { }

  ngOnInit() {
    // カレンダーのマス数だけ、情報を揃える
    for(var y = 0; y < 5; ++y){
      const weekLine: DayInfo[] = [];
      for(var x = 0; x < 7; ++x){
        weekLine.push(new DayInfo(0));
      }
      this.CalendarTable.push(weekLine);
    }
  }

}

class DayInfo{
  // 日付
  value: number;
  // 「今日」を表すか？
  todayFlg: boolean = false;
  // 「今月」の日付か？
  thisMonthFlg: boolean = true;
  // コンストラクタ
  constructor(value: number){
    this.value = value;
  }
}