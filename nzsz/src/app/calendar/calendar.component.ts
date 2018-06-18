import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  /* カレンダー情報 */
  CalendarTable: DayInfo[][] = [];
  /* 今月を表す文字列 */
  ThisMonthString: string = "";

  /* CalendarTableの縦の大きさ */
  private static readonly height: number = 5;
  /* CalendarTableの横の大きさ */
  private static readonly width: number = 7;

  constructor() {
    // カレンダーのマス数だけ、情報を揃える
    for(var y = 0; y < CalendarComponent.height; ++y){
      const weekLine: DayInfo[] = [];
      for(var x = 0; x < CalendarComponent.width; ++x){
        weekLine.push(new DayInfo());
      }
      this.CalendarTable.push(weekLine);
    }
  }

  ngOnInit() {}

  // 日付をセットする
  @Input()
  set date(date: string) {
    // 今日の月情報をセットする
    this.ThisMonthString = moment(date).format("YYYY/MM");
    // カレンダー左上の日付を取得する
    const beginDay = moment(date).startOf("month").day(0);
    // カレンダーの各日付における情報をセットする
    const today = moment(date);
    for(var y = 0; y < CalendarComponent.height; ++y){
      for(var x = 0; x < CalendarComponent.width; ++x){
        const setDayData = this.CalendarTable[y][x];
        setDayData.date = beginDay.toDate();
        setDayData.setFlgs(today.toDate());
        beginDay.add(1, "day");
      }
    }
  }

  // タップされた日付を親に受け渡す
  @Output() onTap = new EventEmitter<Date>();
  tap(date: Date){
    this.onTap.emit(date);
  }
}

class DayInfo{
  // 正確な日付
  date: Date;
  // 「今日」を表すか？
  todayFlg: boolean = false;
  // 「今月」の日付か？
  thisMonthFlg: boolean = true;
  // 日付の数字
  get value(): number{
    return this.date.getDate();
  }
  // 2つのフラグを、別の日付との比較から判定
  setFlgs(date: Date): void{
    this.todayFlg = (moment(date).format("YYYY-MM-DD") == moment(this.date).format("YYYY-MM-DD"));
    this.thisMonthFlg = (date.getMonth() == this.date.getMonth());
  }
}