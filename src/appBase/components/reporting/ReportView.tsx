import React from "react";
import { BarChart } from "./BarChart";
import { GroupedReport } from "./GroupedReport";
import { DisplayBox, ExportLink } from "../";
import { ReportInterface } from "../../interfaces/ReportInterfaces";

interface Props { report?: ReportInterface }

export const ReportView = (props: Props) => {

    const handlePrint = (e: React.MouseEvent) => {
        e.preventDefault();
        var content = document.getElementById("chartBox").getElementsByClassName("content")[0].innerHTML;
        var printFrame: any = document.getElementById("printFrame");
        var cw = printFrame.contentWindow;
        //cw.document.open;
        cw.document.write(content);
        //cw.document.close();
        cw.focus();
        cw.print();
    }

    const getEditContent = () => {
        const result: JSX.Element[] = [];

        if (props.report?.data !== undefined) {
            result.push(<a key={result.length - 1} href="about:blank" onClick={handlePrint} title="print"><i className="fas fa-print"></i></a>);
            result.push(<ExportLink key={result.length - 1} data={props.report.data} filename={props.report.title.replace(" ", "_") + ".csv"} />);
        }
        return result;
    }

    const getChart = () => {
        var result = <></>
        switch (props.report.reportType) {
            case "Area Chart":
            case "Bar Chart":
                result = (<BarChart report={props.report} />);
                break;
            default:
                result = (<GroupedReport report={props.report} />);
                break;
        }
        return result;
    }

    return (
        <>
            <DisplayBox id={"chartBox-" + props.report?.keyName} data-cy={"chartBox-" + props.report?.keyName} headerIcon="far fa-chart-bar" headerText={props.report.title} editContent={getEditContent()} >
                {getChart()}
            </DisplayBox >
        </>
    );

}
