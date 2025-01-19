import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterType',
  pure: true
})
export class FilterTypePipe implements PipeTransform {

  transform(items: any[], type: string): any[] {    
    if (!items || !type || type === 'all') {
      return items;
    }
    const result = [...items];
    return result.filter(item => item.type === type); 
  }

}
