import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { Assignment as AssignmentIcon } from "@mui/icons-material";
import { Loading, PageHeader, Locale, SmallButton, ApiHelper, UserHelper, Permissions } from "@churchapps/apphelper";
import { useQuery } from "@tanstack/react-query";
import { type GroupInterface } from "@churchapps/helpers";
import { type PlanTypeInterface } from "../helpers";
import { PlanList } from "./components/PlanList";
import { Breadcrumbs } from "../components/ui";

export const PlanTypePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const canEdit = UserHelper.checkAccess(Permissions.membershipApi.plans.edit);

  const planType = useQuery<PlanTypeInterface>({
    queryKey: [`/planTypes/${params.id}`, "DoingApi"],
    enabled: !!params.id,
  });

  const ministry = useQuery<GroupInterface>({
    queryKey: [`/groups/${planType.data?.ministryId}`, "MembershipApi"],
    enabled: !!planType.data?.ministryId,
  });

  const handleDeletePlanType = React.useCallback(() => {
    if (window.confirm(Locale.label("plans.planTypePage.deleteConfirm"))) {
      ApiHelper.delete("/planTypes/" + planType.data?.id, "DoingApi").then(() => {
        navigate("/plans/ministries/" + ministry.data?.id);
      });
    }
  }, [planType.data?.id, ministry.data?.id, navigate]);

  if (planType.isLoading || ministry.isLoading) return <Loading />;
  
  if (!planType.data || !ministry.data) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            {Locale.label("plans.planTypePage.notFound")}
          </Typography>
        </Box>
      </Container>
    );
  }

  const breadcrumbItems = [
    { label: Locale.label("components.wrapper.plans") || "Plans", path: "/plans" },
    { label: ministry.data.name, path: `/plans/ministries/${ministry.data.id}` },
    { label: planType.data.name }
  ];

  return (
    <>
      <Box sx={{
        backgroundColor: "var(--c1l2)",
        color: "#FFF",
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        width: '100vw',
        '--c1l2': '#568BDA',
        paddingX: { xs: 2, sm: 3, md: 4 },
        paddingTop: 1.5,
        paddingBottom: 0.5,
        zIndex: 1
      }}>
        <Breadcrumbs items={breadcrumbItems} showHome={true} />
      </Box>
      <Box sx={{ marginTop: '-1.5rem' }}>
        <PageHeader
          icon={<AssignmentIcon />}
          title={planType.data.name || Locale.label("plans.planTypePage.planType")}
          subtitle={Locale.label("plans.planTypePage.subtitle")}>
          {canEdit && <SmallButton color="error" icon="delete" onClick={handleDeletePlanType} />}
        </PageHeader>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <PlanList key="plans" ministry={ministry.data} planTypeId={planType.data.id} />
      </Box>
    </>
  );
};