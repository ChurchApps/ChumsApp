import React from "react";
import { ApiHelper, DonationEdit, DonationBatchInterface, UserHelper, Donations, FundInterface, Permissions } from "./components";
import { RouteComponentProps } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

type TParams = { id?: string };

export const DonationBatchPage = ({ match }: RouteComponentProps<TParams>) => {
    const [editDonationId, setEditDonationId] = React.useState("notset");
    const [batch, setBatch] = React.useState<DonationBatchInterface>({});
    const [funds, setFunds] = React.useState<FundInterface[]>([]);

    const showAddDonation = () => { setEditDonationId(""); }
    const showEditDonation = (id: string) => { setEditDonationId(id); }
    const donationUpdated = () => { setEditDonationId("notset"); loadData(); }

    const loadData = () => {
        ApiHelper.get("/donationbatches/" + match.params.id, "GivingApi").then(data => setBatch(data));
        ApiHelper.get("/funds", "GivingApi").then(data => setFunds(data));
    }

    const getSidebarModules = () => {
        var result = [];
        if (editDonationId !== "notset") result.push(<DonationEdit donationId={editDonationId} updatedFunction={donationUpdated} funds={funds} batchId={batch.id} />)
        return result;
    }

    React.useEffect(loadData, [match.params.id]);

    if (!UserHelper.checkAccess(Permissions.givingApi.donations.view)) return (<></>);
    return (
        <>
            <h1><i className="fas fa-hand-holding-usd"></i> Batch #{batch.id}</h1>
            <Row>
                <Col lg={8}><Donations batch={batch} addFunction={showAddDonation} editFunction={showEditDonation} /></Col>
                <Col lg={4}>{getSidebarModules()}</Col>
            </Row>
        </>
    );
}

