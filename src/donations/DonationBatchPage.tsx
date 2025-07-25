import React from "react";
import { DonationEdit, Donations } from "./components";
import { type DonationBatchInterface, UserHelper, type FundInterface, Permissions, type DonationInterface, DateHelper, CurrencyHelper } from "@churchapps/apphelper";
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
      {/* Modern Blue Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }} sx={{ width: "100%" }}>
          {/* Left side: Title and Icon */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DonationIcon sx={{ fontSize: 32, color: "#FFF" }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                }}
              >
                {batch.data?.name || "Donation Batch"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                {batch.data?.batchDate ? `Batch Date: ${DateHelper.prettyDate(new Date(batch.data.batchDate))}` : "Manage donations in this batch"}
              </Typography>
            </Box>
          </Stack>

          {/* Right side: Quick Actions */}
          {UserHelper.checkAccess(Permissions.givingApi.donations.edit) && funds.data?.length > 0 && (
            <Box>
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
            </Box>
          )}
        </Stack>

        {/* Statistics Row */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} flexWrap="wrap" useFlexGap justifyContent="flex-start" sx={{ mt: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ReceiptIcon sx={{ color: "#FFF", fontSize: 20 }} />
            <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
              {stats.totalDonations}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
              Total Donations
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <MoneyIcon sx={{ color: "#FFF", fontSize: 20 }} />
            <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
              {CurrencyHelper.formatCurrency(stats.totalAmount)}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
              Total Amount
            </Typography>
          </Stack>
        </Stack>
      </Box>

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
