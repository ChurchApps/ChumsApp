import React, { memo, useCallback, useMemo } from "react";
import { Stack, Typography, Button, Box, Card, CardContent } from "@mui/material";
import { Print as PrintIcon, Add as AddIcon, Album as AlbumIcon } from "@mui/icons-material";
import { ApiHelper, type PlanInterface, UserHelper, Permissions } from "@churchapps/apphelper";
import { type PlanItemInterface } from "../../helpers";
import { PlanItemEdit } from "./PlanItemEdit";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PlanItem } from "./PlanItem";
import { DraggableWrapper } from "../../components/DraggableWrapper";
import { DroppableWrapper } from "../../components/DroppableWrapper";
import { Link } from "react-router-dom";

interface Props {
  plan: PlanInterface;
}

export const ServiceOrder = memo((props: Props) => {
  const [planItems, setPlanItems] = React.useState<PlanItemInterface[]>([]);
  const canEdit = UserHelper.checkAccess(Permissions.membershipApi.plans.edit);
  const [editPlanItem, setEditPlanItem] = React.useState<PlanItemInterface>(null);
  const [showHeaderDrop, setShowHeaderDrop] = React.useState(false);
  const [showItemDrop, setShowItemDrop] = React.useState(false);

  const loadData = useCallback(async () => {
    if (props.plan?.id) {
      ApiHelper.get("/planItems/plan/" + props.plan.id.toString(), "DoingApi").then((d) => {
        setPlanItems(d);
      });
    }
  }, [props.plan?.id]);

  const addHeader = useCallback(() => {
    setEditPlanItem({ itemType: "header", planId: props.plan.id, sort: planItems?.length + 1 || 1 });
  }, [props.plan.id, planItems?.length]);

  const editContent = useMemo(
    () => (
      <Stack direction="row" spacing={1}>
        <Button
          component={Link}
          to={`/plans/print/${props.plan?.id}`}
          variant="outlined"
          startIcon={<PrintIcon />}
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
          }}>
          Print
        </Button>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addHeader}
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
            }}>
            Add Section
          </Button>
        )}
      </Stack>
    ),
    [props.plan?.id, addHeader, canEdit]
  );

  const handleDrop = useCallback(
    (data: any, sort: number) => {
      console.log(JSON.stringify(data));
      console.log("handleDrop Header", data);
      const pi = data.data as PlanItemInterface;
      pi.sort = sort;
      ApiHelper.post("/planItems/sort", pi, "DoingApi").then(() => {
        loadData();
      });
    },
    [loadData]
  );

  const wrapPlanItem = useCallback(
    (pi: PlanItemInterface, index: number) => (
      <>
        {canEdit && showHeaderDrop && (
          <DroppableWrapper
            accept="planItemHeader"
            onDrop={(item) => {
              handleDrop(item, index + 0.5);
            }}>
            &nbsp;
          </DroppableWrapper>
        )}
        {canEdit ? (
          <DraggableWrapper
            dndType="planItemHeader"
            data={pi}
            draggingCallback={(isDragging) => {
              console.log("isDragging", isDragging);
              setShowHeaderDrop(isDragging);
            }}>
            <PlanItem
              planItem={pi}
              setEditPlanItem={setEditPlanItem}
              showItemDrop={showItemDrop}
              onDragChange={(dragging) => {
                console.log("Dragging", dragging);
                setShowItemDrop(dragging);
              }}
              onChange={() => {
                loadData();
              }}
            />
          </DraggableWrapper>
        ) : (
          <PlanItem
            planItem={pi}
            setEditPlanItem={null}
            showItemDrop={false}
            onDragChange={() => {}}
            onChange={() => {}}
          />
        )}
      </>
    ),
    [canEdit, showHeaderDrop, showItemDrop, handleDrop, loadData]
  );

  React.useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      {editPlanItem && canEdit && (
        <Box sx={{ mb: 3 }}>
          <PlanItemEdit
            planItem={editPlanItem}
            onDone={() => {
              setEditPlanItem(null);
              loadData();
            }}
          />
        </Box>
      )}

      <Card
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "grey.200",
          transition: "all 0.2s ease-in-out",
          "&:hover": { boxShadow: 2 },
        }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AlbumIcon sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                Order of Service
              </Typography>
            </Stack>
            {editContent}
          </Stack>

          <Box
            sx={{
              minHeight: 200,
              p: 3,
              border: "1px dashed",
              borderColor: "grey.300",
              borderRadius: 2,
              backgroundColor: "grey.50",
            }}>
            <DndProvider backend={HTML5Backend}>
              {planItems.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    color: "text.secondary",
                  }}>
                  <AlbumIcon sx={{ fontSize: 48, mb: 2, color: "grey.400" }} />
                  <Typography variant="body1">No service items yet. Add your first item to get started.</Typography>
                </Box>
              ) : (
                <>
                  {planItems.map((pi, i) => wrapPlanItem(pi, i))}
                  {showHeaderDrop && (
                    <DroppableWrapper
                      accept="planItemHeader"
                      onDrop={(item) => {
                        handleDrop(item, planItems?.length + 1);
                      }}>
                      <Box
                        sx={{
                          height: 40,
                          border: "2px dashed",
                          borderColor: "primary.main",
                          borderRadius: 1,
                          backgroundColor: "primary.light",
                          opacity: 0.3,
                          mb: 1,
                        }}
                      />
                    </DroppableWrapper>
                  )}
                </>
              )}
            </DndProvider>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
});
