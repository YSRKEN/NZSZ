import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit {

  AutoLoadFlg: boolean = this.settings.AutoLoadFlg;

  constructor(private router: Router, private settings: SettingsService) {}

  ngOnInit() {}

  /** メイン画面に遷移 */
  navigateMain(){
    this.router.navigate(['/']);
  }

  changeAutoLoadFlg(){
    this.settings.AutoLoadFlg = this.AutoLoadFlg;
  }
}
