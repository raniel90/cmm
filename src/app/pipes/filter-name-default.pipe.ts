import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterNameDefault',
    pure: false
})
export class FilterNameDefaultPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter || !filter.name) {
            return items;
        }

        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1 || item.artist.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1);
    }
}