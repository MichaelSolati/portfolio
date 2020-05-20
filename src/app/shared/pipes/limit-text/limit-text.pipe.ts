import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitText'
})
export class LimitTextPipe implements PipeTransform {
  transform(value: string = '', length: number = 140): string {
    return (value || '').length < length ? value : value.substr(0, length - 3)+'...';
  }
}
