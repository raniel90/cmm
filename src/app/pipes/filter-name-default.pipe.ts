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
        return items.filter(item => {
            const themes = item.theme ? item.theme.join(',') : '';

            if (item.name && item.name.toLowerCase().includes(filter.name.toLowerCase())) {
                return true;
            }

            if (item.artist && item.artist.toLowerCase().includes(filter.name.toLowerCase())) {
                return true;
            }

            if (item.beginMusic && item.beginMusic.toLowerCase().includes(filter.name.toLowerCase())) {
                return true;
            }

            if (themes && themes.toLowerCase().includes(filter.name.toLowerCase())) {
                return true;
            }

            return false;
        });
    }
}