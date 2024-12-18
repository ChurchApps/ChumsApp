import React from "react";
import { DonationEdit, Donations } from "./components";
import { ApiHelper, DonationBatchInterface, UserHelper, FundInterface, Permissions, Locale } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { Grid, Icon } from "@mui/material"
import { Banner } from "../baseComponents/Banner";

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
    <>
      <Banner><h1>{Locale.label("donations.donations.batches")}: {batch.name}</h1></Banner>
      <div id="mainContent">
        {getSidebarModules()}
        <Donations batch={batch} addFunction={showAddDonation} editFunction={showEditDonation} funds={funds} />

      </div>
    </>
  );
}

