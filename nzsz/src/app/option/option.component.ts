import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../service/settings.service';

/**
 * オプション画面のComponent
 */
@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit {

  /**
   * カレンダーの日付をタップした際に自動読込みするか？
   */
  AutoLoadFlg: boolean = this.settings.AutoLoadFlg;

  constructor(private router: Router, private settings: SettingsService) {}

  ngOnInit() {}

  /**
   * メイン画面に遷移
  */
  navigateMain(){
    this.router.navigate(['/']);
  }
  /**
   * 自動読み込みの設定を変更する
   */
  changeAutoLoadFlg(){
    this.settings.AutoLoadFlg = this.AutoLoadFlg;
  }
}
