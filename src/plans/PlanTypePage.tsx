import React from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { Assignment as AssignmentIcon } from "@mui/icons-material";
import { Loading, PageHeader } from "@churchapps/apphelper";
import { useQuery } from "@tanstack/react-query";
import { type GroupInterface } from "@churchapps/helpers";
import { type PlanTypeInterface } from "../helpers";
import { PlanList } from "./components/PlanList";

export const PlanTypePage = () => {
  const params = useParams();

  const planType = useQuery<PlanTypeInterface>({
    queryKey: [`/planTypes/${params.id}`, "DoingApi"],
    enabled: !!params.id,
  });

  const ministry = useQuery<GroupInterface>({
    queryKey: [`/groups/${planType.data?.ministryId}`, "MembershipApi"],
    enabled: !!planType.data?.ministryId,
  });

  if (planType.isLoading || ministry.isLoading) return <Loading />;
  
  if (!planType.data || !ministry.data) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            Plan type not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <PageHeader 
        icon={<AssignmentIcon />} 
        title={planType.data.name || "Plan Type"} 
        subtitle="Manage service plans for this type"
      />
      
      {/* Content */}
      <Box sx={{ p: 3 }}>
        <PlanList key="plans" ministry={ministry.data} planTypeId={planType.data.id} />
      </Box>
    </>
  );
};