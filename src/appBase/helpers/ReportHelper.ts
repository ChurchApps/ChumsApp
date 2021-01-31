import { ArrayHelper } from "./ArrayHelper";
import { ReportHeadingInterface } from "../interfaces/ReportInterfaces";

export class ReportHelper {

    static getRows(data: any, headings: ReportHeadingInterface[], groupings: string[]) {
        console.log("DATA");
        console.log(data);
        if (groupings.length < 2) return this.getSingleGroupingRows(data, headings, groupings);
        else return this.getMultiGroupingRows(data, headings, groupings);
    }

    private static getSingleGroupingRows(data: any, headings: ReportHeadingInterface[], groupings: string[]) {
        const result: any[] = [];
        const heading = ArrayHelper.getOne(headings, "field", groupings[0]);
        const valHeading = headings[headings.length - 1];
        data.forEach((d: any) => {
            const row: any[] = [];
            row.push(d[heading.field]);
            row.push(d[valHeading.field]);
            result.push(row);
        });
        return result;
    }

    private static getMultiGroupingRows(data: any, headings: ReportHeadingInterface[], groupings: string[]) {
        const result: any[] = [];
        const primaryHeading: ReportHeadingInterface = ArrayHelper.getOne(headings, "field", groupings[0]);
        const secondaryHeading: ReportHeadingInterface = ArrayHelper.getOne(headings, "field", groupings[1]);
        //var primaryGroupValues: string[] = ArrayHelper.getUniqueValues(data, primaryHeading.field);
        var secondaryGroupValues: string[] = ArrayHelper.getUniqueValues(data, secondaryHeading.field);
        const valHeading = headings[headings.length - 1];

        data.forEach((d: any) => {
            var row: any[] = [];
            if (result.length > 0 && result[result.length - 1][0] === d[primaryHeading.field]) row = result[result.length - 1];
            else {
                row.push(d[primaryHeading.field]);
                secondaryGroupValues.forEach(() => { row.push(0); });
                result.push(row);
            }

            const currentVal = d[secondaryHeading.field];
            var idx = -1;
            for (let i = 0; i < secondaryGroupValues.length; i++) {
                if (secondaryGroupValues[i] === currentVal) idx = i + 1;
            }
            if (idx > -1) row[idx] = d[valHeading.field];

            //todo set the values
        });
        return result;
    }



}