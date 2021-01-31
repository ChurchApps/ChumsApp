import React from "react";
import { ReportInterface, ReportHeadingInterface } from "../../interfaces/ReportInterfaces";

interface Props { report?: ReportInterface }

export const GroupedReport = (props: Props) => {


    const getTableHeader = () => {
        if (props.report === undefined || props.report === null || props.report.headings === undefined) return null;
        const cells: JSX.Element[] = [];
        for (let j = props.report.groupings.length; j < props.report.headings.length; j++) {
            const val = props.report.headings[j].name
            cells.push(<th>{val}</th>);
        }
        return (<tr>{cells}</tr>);
    }

    const getRows = () => {
        if (props.report?.data === undefined) return null;
        else {
            const groupLevels = props.report.groupings.length;
            const prevValues: any[] = [];
            const result: JSX.Element[] = [];
            props.report.data.forEach(d => { addRow(result, d, groupLevels, props.report.headings, prevValues); });
            return result;
        }
    }

    const addRow = (result: JSX.Element[], row: any, groupLevels: number, headings: ReportHeadingInterface[], prevValues: any[]) => {
        for (let j = 0; j < groupLevels; j++) {
            const heading = headings[j];
            const groupVal = row[heading.field];
            if (prevValues.length <= j || prevValues[j] !== groupVal) {
                prevValues[j] = groupVal;
                result.push(<tr><td className={"heading" + (j + 1).toString()} colSpan={headings.length - groupLevels}>{groupVal}</td></tr>);
            }
        }

        //Add row
        const cells: JSX.Element[] = [];
        for (let j = groupLevels; j < headings.length; j++) {
            const val = row[headings[j].field];
            if (j === groupLevels) cells.push(<td className={"indent" + (groupLevels + 1)}>{val}</td>);
            else cells.push(<td>{val}</td>);
        }
        result.push(<tr>{cells}</tr>);
        return result;

    }



    return (
        <table className="table report table-sm">
            <thead className="thead-dark">
                {getTableHeader()}
            </thead>
            <tbody>
                {getRows()}
            </tbody>
        </table>
    );
}
