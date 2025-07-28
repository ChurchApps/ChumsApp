import React from "react";
import { DonationEdit, Donations } from "./components";
import { UserHelper, Permissions, DateHelper, CurrencyHelper, PageHeader } from "@churchapps/apphelper";
import { type DonationBatchInterface, type FundInterface, type DonationInterface } from "@churchapps/helpers";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Card, Stack, Icon, Button } from "@mui/material";
import { VolunteerActivism as DonationIcon, Receipt as ReceiptIcon, AttachMoney as MoneyIcon, Add as AddIcon } from "@mui/icons-material";

export const DonationBatchPage = () => {
  const params = useParams();
  const [editDonationId, setEditDonationId] = React.useState("notset");

  const batch = useQuery<DonationBatchInterface>({
    queryKey: ["/donationbatches/" + params.id, "GivingApi"],
    placeholderData: {},
  });

  const funds = useQuery<FundInterface[]>({
    queryKey: ["/funds", "GivingApi"],
    placeholderData: [],
  });

  const donations = useQuery<DonationInterface[]>({
    queryKey: ["/donations?batchId=" + params.id, "GivingApi"],
    placeholderData: [],
  });

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

  const getEditModules = () => {
    const result = [];
    if (editDonationId !== "notset") result.push(<DonationEdit key="donationEdit" donationId={editDonationId} updatedFunction={donationUpdated} funds={funds.data} batchId={batch.data.id} />);
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

  return (
    <>
      <PageHeader
        icon={<DonationIcon />}
        title={batch.data?.name || "Donation Batch"}
        subtitle={batch.data?.batchDate ? `Batch Date: ${DateHelper.prettyDate(new Date(batch.data.batchDate))}` : "Manage donations in this batch"}
        statistics={[
          {
            icon: <ReceiptIcon />,
            value: stats.totalDonations,
            label: "Total Donations"
          },
          {
            icon: <MoneyIcon />,
            value: CurrencyHelper.formatCurrency(stats.totalAmount),
            label: "Total Amount"
          }
        ]}
      >
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
            }}
          >
            Add Donation
          </Button>
        )}
      </PageHeader>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Edit content appears above when editing */}
        {editDonationId !== "notset" && (
          <Box sx={{ mb: 3 }}>
            <Card>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Icon>edit</Icon>
                  <Typography variant="h6">{editDonationId === "" ? "Add Donation" : "Edit Donation"}</Typography>
                </Stack>
              </Box>
              <Box sx={{ p: 2 }}>{getEditModules()}</Box>
            </Card>
          </Box>
        )}

        {/* Main donations table */}
        <Card>
          <Donations batch={batch.data} editFunction={showEditDonation} funds={funds.data} />
        </Card>
      </Box>
    </>
  );
};
