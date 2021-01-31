export class ArrayHelper {
    static getIds(array: any[], propertyName: string) {
        const result: number[] = [];
        for (const item of array) {
            const id = parseInt(item[propertyName], 0);
            if (id > 0 && result.indexOf(id) === -1) result.push(id);
        }
        return result;
    }

    static getOne(array: any[], propertyName: string, value: any) {
        for (const item of array) if (item[propertyName] === value) return item;
        return null
    }

    static getAll(array: any[], propertyName: string, value: any) {
        const result: any[] = []
        for (const item of array) if (item[propertyName] === value) result.push(item);
        return result;
    }

    static getUniqueValues(array: any[], propertyName: string) {
        const result: any[] = [];

        for (const item of array) {
            const val = (propertyName.indexOf(".") === -1) ? item[propertyName] : this.getDeepValue(item, propertyName)
            if (result.indexOf(val) === -1) result.push(val);
        }
        return result;
    }

    static getDeepValue(item: any, propertyName: string) {
        const propertyNames = propertyName.split(".");
        var result: any = item;
        propertyNames.forEach(name => {
            result = result[name];
        });
        return result;
    }

}