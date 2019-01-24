import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterName',
    pure: false
})
export class FilterNamePipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }

        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1 || item.artist.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1);
    }
}