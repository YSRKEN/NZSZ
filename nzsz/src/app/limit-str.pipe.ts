import { Pipe, PipeTransform } from '@angular/core';

function bytes(x: string) {
  return(encodeURIComponent(x).replace(/%../g,"x").length);
}

@Pipe({
  name: 'limitStr'
})
export class LimitStrPipe implements PipeTransform {
  transform(value: string, length: number): string {
    if(bytes(value) > length){
      return value.substr(0, length - 3) + "...";
    }else{
      return value;
    }
  }
}
