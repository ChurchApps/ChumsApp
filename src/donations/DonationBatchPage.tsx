import React from "react";
import { DonationEdit, Donations, BatchEdit } from "./components";
import { UserHelper, Permissions, DateHelper, CurrencyHelper, PageHeader } from "@churchapps/apphelper";
import { type DonationBatchInterface, type FundInterface, type DonationInterface, type FundDonationInterface, type PersonInterface } from "@churchapps/helpers";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Card, Stack, Button } from "@mui/material";
import { VolunteerActivism as DonationIcon, Receipt as ReceiptIcon, AttachMoney as MoneyIcon, Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { BatchEntry } from "./components/BatchEntry";

export const DonationBatchPage = () => {
  const params = useParams();
  const [editDonationId, setEditDonationId] = React.useState("notset");
  const [editBatch, setEditBatch] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [defaultsSet, setDefaultsSet] = React.useState(false);

  // Default values that persist for the entire batch page session
  const [defaultValues, setDefaultValues] = React.useState({
    personId: "",
    person: null as PersonInterface | null,
    donationDate: new Date(),
    method: "Check",
    methodDetails: "",
    notes: "",
    fundDonations: [{ amount: 0, fundId: "" }] as FundDonationInterface[]
  });

  const batch = useQuery<DonationBatchInterface>({ queryKey: ["/donationbatches/" + params.id, "GivingApi"] });

  const funds = useQuery<FundInterface[]>({
    queryKey: ["/funds", "GivingApi"],
    placeholderData: [],
  });

  const donations = useQuery<DonationInterface[]>({
    queryKey: ["/donations?batchId=" + params.id, "GivingApi"],
    placeholderData: [],
  });

  React.useEffect(() => {
    setRefreshKey(Math.random())

  }, [donations.data]);

  const showAddDonation = () => {
    setEditDonationId("");
  };
  const showEditDonation = (id: string) => {
    setEditDonationId(id);
  };
  const donationUpdated = () => {
    setEditDonationId("notset");
    batch.refetch();
    donations.refetch();
  };

  const batchUpdated = () => {
    setEditBatch(false);
    batch.refetch();
  };

  const getEditModules = () => {
    const result = [];
    if (editDonationId !== "notset") result.push(
      <DonationEdit
        key="donationEdit"
        donationId={editDonationId}
        updatedFunction={donationUpdated}
        funds={funds.data}
        batchId={batch.data.id}
        defaultValues={defaultValues}
        setDefaultValues={setDefaultValues}
        defaultsSet={defaultsSet}
        setDefaultsSet={setDefaultsSet}
      />
    );
    if (editBatch && batch.data?.id) result.push(<BatchEdit key="batchEdit" batchId={batch.data.id} updatedFunction={batchUpdated} />);
    return result;
  };

  const [stats, setStats] = React.useState({
    totalDonations: 0,
    totalAmount: 0,
  });

  React.useEffect(() => {
    if (donations.data) {
      const totalDonations = donations.data.length;
      const totalAmount = donations.data.reduce((sum, donation) => sum + (donation.amount || 0), 0);

      setStats({
        totalDonations,
        totalAmount,
      });
    }
  }, [donations.data]);

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.view)) return <></>;

  console.log("BATCH IS", batch.data);

  return (
    <>
      <PageHeader
        icon={<DonationIcon />}
        title={batch.data?.name || "Donation Batch"}
        subtitle={batch.data?.batchDate ? `Batch Date: ${DateHelper.prettyDate(new Date(batch.data.batchDate.split("T")[0] + "T00:00:00"))}` : "Manage donations in this batch"}
        statistics={[
          {
            icon: <ReceiptIcon />,
            value: stats.totalDonations,
            label: "Total Donations",
          },
          {
            icon: <MoneyIcon />,
            value: CurrencyHelper.formatCurrency(stats.totalAmount),
            label: "Total Amount",
          },
        ]}>
        <Stack direction="row" spacing={2}>
          {UserHelper.checkAccess(Permissions.givingApi.donations.edit) && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditBatch(true)}
              data-testid="edit-batch-button"
              sx={{
                color: "#FFF",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}>
              Edit Batch
            </Button>
          )}
          {UserHelper.checkAccess(Permissions.givingApi.donations.edit) && funds.data?.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={showAddDonation}
              data-testid="add-donation-button"
              sx={{
                color: "#FFF",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}>
              Add Donation
            </Button>
          )}
        </Stack>
      </PageHeader>

      {/* Main Content */}
      <BatchEntry batchId={batch.data?.id} onAdded={() => { donations.refetch() }} />
      <Box sx={{ p: 3 }}>
        {/* Edit content appears above when editing */}
        {(editDonationId !== "notset" || editBatch) && <Box sx={{ mb: 3 }}>{getEditModules()}</Box>}

        {/* Main donations table */}
        <Card>
          <Donations batch={batch.data} editFunction={showEditDonation} funds={funds.data} refreshKey={refreshKey} />
        </Card>
      </Box>
    </>
  );
};
