import React from "react";
import { ApiHelper, DonationEdit, DonationBatchInterface, UserHelper, Donations, FundInterface, Permissions } from "./components";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { Wrapper } from "../components/Wrapper";

export const DonationBatchPage = () => {
  const params = useParams();
  const [editDonationId, setEditDonationId] = React.useState("notset");
  const [batch, setBatch] = React.useState<DonationBatchInterface>({});
  const [funds, setFunds] = React.useState<FundInterface[]>([]);

  const showAddDonation = () => { setEditDonationId(""); }
  const showEditDonation = (id: string) => { setEditDonationId(id); }
  const donationUpdated = () => { setEditDonationId("notset"); loadData(); }

  const loadData = () => {
    ApiHelper.get("/donationbatches/" + params.id, "GivingApi").then(data => setBatch(data));
    ApiHelper.get("/funds", "GivingApi").then(data => setFunds(data));
  }

  const getSidebarModules = () => {
    let result = [];
    if (editDonationId !== "notset") result.push(<DonationEdit key="donationEdit" donationId={editDonationId} updatedFunction={donationUpdated} funds={funds} batchId={batch.id} />)
    return result;
  }

  React.useEffect(loadData, [params.id]);

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.view)) return (<></>);
  return (
    <Wrapper pageTitle={"Batch #" + batch.id}>
      <Row>
        <Col lg={8}><Donations batch={batch} addFunction={showAddDonation} editFunction={showEditDonation} funds={funds} /></Col>
        <Col lg={4}>{getSidebarModules()}</Col>
      </Row>
    </Wrapper>
  );
}

