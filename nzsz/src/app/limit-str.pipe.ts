import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitStr'
})
export class LimitStrPipe implements PipeTransform {
  transform(value: string, length: number): string {
    if(value.length > length){
      return value.substr(0, length - 3) + "...";
    }else{
      return value;
    }
  }
}
