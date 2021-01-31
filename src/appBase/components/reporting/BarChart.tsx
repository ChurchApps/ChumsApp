import React from "react";
import { ReportInterface } from "../../interfaces/ReportInterfaces";
import { Chart } from "react-google-charts";
import { ReportHelper } from "../../helpers/ReportHelper";

interface Props { report?: ReportInterface }

export const BarChart = (props: Props) => {
    var rows: any = [];

    const getChartData = () => {
        rows = [];
        rows.push(getHeader());
        ReportHelper.getRows(props.report.data, props.report.headings, props.report.groupings).forEach(r => rows.push(r));
        return rows;
    }

    /*
    When multiple grouping fields are provided, the second heading is a grouping and will be broken out into several columns on the report, replacing the third Value heading.
         Example: Input headings of ["Week", "Fund", "Amount"] could result in ["Week", "General Fund", "Van Fund", "Roof Fund"].
    */
    const getHeader = () => {
        const headings = props.report.headings;
        const groupings = props.report.groupings;
        if (groupings.length < 2) return [headings[0].name, headings[headings.length - 1].name];    //Single grouping
        else {
            //Untested code
            const result = [headings[0].name];
            const groupValues: string[] = [];
            const groupField = headings[1].field;
            props.report.data.forEach(d => {
                if (groupField.indexOf("details.") === -1) {
                    if (groupValues.indexOf(d[groupField]) === -1) groupValues.push(d[groupField]);
                } else {
                    const shortField = groupField.replace("details.", "");
                    d.details.forEach((detail: any) => {
                        if (groupValues.indexOf(detail[shortField]) === -1) groupValues.push(detail[shortField]);
                    });
                }
            });
            groupValues.forEach(v => result.push(v));
            return result;
        }
    }

    const chartData = getChartData();
    if (chartData.length < 2) return (<>No results</>);
    else {
        var result = <></>
        switch (props.report.reportType) {
            case "Area Chart":
                result = (<Chart chartType="AreaChart" data={getChartData()} width="100%" height="400px" options={{ height: 400, legend: { position: "top", maxLines: 3 }, bar: { groupWidth: "75%" }, isStacked: true }} />);
                break;
            default:
                result = (<Chart chartType="ColumnChart" data={getChartData()} width="100%" height="400px" options={{ height: 400, legend: { position: "top", maxLines: 3 }, bar: { groupWidth: "75%" }, isStacked: true }} />);
                break;
        }
        return result;
    }


}
