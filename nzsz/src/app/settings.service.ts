import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() {
  }

  get AutoLoadFlg(){
    if(window.localStorage.getItem("nzsz-AutoLoadFlg") != null){
      return (window.localStorage.getItem("nzsz-AutoLoadFlg") == "true");
    }else{
      return false;
    }
  }
  set AutoLoadFlg(flg: boolean){
    window.localStorage.setItem("nzsz-AutoLoadFlg", flg ? "true" : "false");
  }
}
