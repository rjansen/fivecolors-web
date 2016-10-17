import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter', pure: false })
export class FilterPipe implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        return value.filter(item => {
            var filterParts = args[0].split(".");
            var currentFilterValue = item;
            filterParts.forEach(filterField => {
                if (currentFilterValue == undefined) {
                    return false;
                }
                currentFilterValue = currentFilterValue[filterField];
            });
            return currentFilterValue == args[1];
        });
    }
}