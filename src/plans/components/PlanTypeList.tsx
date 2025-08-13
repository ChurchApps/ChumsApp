import React from "react";
import { Box, Button, Paper, Typography, Card, CardContent, Stack, IconButton } from "@mui/material";
import { Add as AddIcon, Assignment as AssignmentIcon, Edit as EditIcon } from "@mui/icons-material";
import { Locale, Loading, UserHelper, Permissions } from "@churchapps/apphelper";
import { useQuery } from "@tanstack/react-query";
import { type GroupInterface } from "@churchapps/helpers";
import { type PlanTypeInterface } from "../../helpers";
import { PlanTypeEdit } from "./PlanTypeEdit";
import { Link } from "react-router-dom";

interface Props {
  ministry: GroupInterface;
}

export const PlanTypeList = React.memo(({ ministry }: Props) => {
  const [showAdd, setShowAdd] = React.useState(false);
  const [editItem, setEditItem] = React.useState<PlanTypeInterface | null>(null);
  const canEdit = UserHelper.checkAccess(Permissions.membershipApi.plans.edit);

  const planTypes = useQuery<PlanTypeInterface[]>({
    queryKey: [`/planTypes?ministryId=${ministry.id}`, "DoingApi"],
    enabled: !!ministry.id,
    placeholderData: [],
  });

  const handleAdd = React.useCallback(() => {
    setEditItem({ ministryId: ministry.id });
    setShowAdd(true);
  }, [ministry.id]);

  const handleEdit = React.useCallback((planType: PlanTypeInterface) => {
    setEditItem(planType);
    setShowAdd(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setShowAdd(false);
    setEditItem(null);
    planTypes.refetch();
  }, [planTypes]);

  if (showAdd && canEdit) return <PlanTypeEdit planType={editItem} onClose={handleClose} />;
  if (planTypes.isLoading) return <Loading />;

  const types = planTypes.data || [];

  if (types.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          backgroundColor: "grey.50",
          border: "1px dashed",
          borderColor: "grey.300",
          borderRadius: 2,
        }}>
        <AssignmentIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No plan types found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create plan types to organize your ministry plans
        </Typography>
        {canEdit && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAdd}
            sx={{
              fontSize: "1rem",
              py: 1.5,
              px: 3,
            }}>
            Create Plan Type
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AssignmentIcon sx={{ color: "primary.main" }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
            Plan Types
          </Typography>
        </Stack>
        {canEdit && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAdd}
            size="medium">
            Add Plan Type
          </Button>
        )}
      </Stack>
      
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {types.map((planType) => (
          <Card
            key={planType.id}
            sx={{ 
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography 
                  variant="h6" 
                  component={Link} 
                  to={`/plans/types/${planType.id}`} 
                  sx={{ 
                    textDecoration: "none", 
                    color: "primary.main",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    }
                  }}>
                  {planType.name}
                </Typography>
                {canEdit && (
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(planType);
                    }}
                    sx={{ ml: 1 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
});