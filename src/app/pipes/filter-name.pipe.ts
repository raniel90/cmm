import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterName',
    pure: false
})
export class FilterNamePipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items) {
            return items;
        }

        return items.map(item => {
            item.hidden = false;

            if (!filter || !filter.name) {
                return item;
            }

            if ((item.name.toLowerCase().indexOf(filter.name.toLowerCase()) === -1) && (item.artist.toLowerCase().indexOf(filter.name.toLowerCase()) === -1)) {
                item.hidden = true;
            }

            return item;
        });
    }
}