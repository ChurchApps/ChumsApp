import React from "react";
import { ReportFilterInterface, ReportInterface } from "../../interfaces/ReportInterfaces";
import { Row, Col } from "react-bootstrap";
import { ReportView } from "./ReportView";
import { ReportFilter } from "./ReportFilter";


interface Props { filter: ReportFilterInterface, fetchReport: (filter: ReportFilterInterface) => Promise<ReportInterface> }

export const ReportWithFilter = (props: Props) => {

    const [report, setReport] = React.useState<ReportInterface>(null);
    const [filter, setFilter] = React.useState<ReportFilterInterface>(null);

    const handleFilterUpdate = (filter: ReportFilterInterface) => { setFilter({ ...filter }); }

    React.useEffect(() => {
        props.fetchReport(filter).then(r => { setReport(r) });
    }, [props, filter]);

    React.useEffect(() => { setFilter(props.filter) }, [props.filter]);

    if (report === null || report === undefined) return null;
    else {
        return (
            <Row>
                <Col lg={8}>
                    <ReportView report={report} />
                </Col>
                <Col lg={4}>
                    <ReportFilter key={filter?.keyName || "reportFilter"} filter={filter} updateFunction={handleFilterUpdate} />
                </Col>
            </Row>
        )
    }

}
