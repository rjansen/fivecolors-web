import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter', pure: false })
export class FilterPipe implements PipeTransform {
    transform(items: any[], path: string, value: any = null): any {
        return items.filter(item => {
             var currentFilterValue = item;
             var filterParts = path.split('.');
             filterParts.forEach(filterField => {
                 if (currentFilterValue == undefined) {
                     return false;
                 }
                 currentFilterValue = currentFilterValue[filterField];
             });
             return currentFilterValue == value;
        });
    }
}