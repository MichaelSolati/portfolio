import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'experiences'
})
export class ExperiencesPipe implements PipeTransform {
  transform(experiences: any[], type?: string): any[] {
    return (!type) ? experiences : experiences.filter((e) => e.type === type);
  }
}
