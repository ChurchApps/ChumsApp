import React, { useContext, useCallback } from "react";
import { Menu, MenuItem, Typography, Box, Stack, Button } from "@mui/material";
import { ApiHelper, type TaskInterface, Notes, DateHelper, type ConversationInterface, Locale, Loading } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { ContentPicker } from "./components/ContentPicker";
import UserContext from "../UserContext";
import { RequestedChanges } from "./components/RequestedChanges";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Assignment as TaskIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as OpenIcon,
} from "@mui/icons-material";

export const TaskPage = () => {
  const params = useParams();
  const [modalField, setModalField] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const context = useContext(UserContext);
  const queryClient = useQueryClient();

  const task = useQuery<TaskInterface>({
    queryKey: ["/tasks/" + params.id, "DoingApi"],
    enabled: !!params.id,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: TaskInterface) => {
      return ApiHelper.post("/tasks", [updatedTask], "DoingApi");
    },
    onSuccess: () => {
      task.refetch();
      queryClient.invalidateQueries({ queryKey: ["/tasks", "DoingApi"] });
      queryClient.invalidateQueries({ queryKey: ["/tasks/closed", "DoingApi"] });
    },
  });

  const handleContentPicked = useCallback((contentType: string, contentId: string, label: string) => {
    if (!task.data) return;
    const t = { ...task.data };
    switch (modalField) {
      case "associatedWith":
        t.associatedWithType = contentType;
        t.associatedWithId = contentId;
        t.associatedWithLabel = label;
        break;
      case "assignedTo":
        t.assignedToType = contentType;
        t.assignedToId = contentId;
        t.assignedToLabel = label;
        break;
    }
    updateTaskMutation.mutate(t);
    setModalField("");
  }, [task.data, modalField, updateTaskMutation]);

  const handleStatusChange = useCallback((status: string) => {
    if (!task.data) return;
    const t = { ...task.data };
    t.status = status;
    t.dateClosed = status === "Open" ? null : new Date();
    updateTaskMutation.mutate(t);
    closeStatusMenu();
  }, [task.data, updateTaskMutation, closeStatusMenu]);

  const handleModalClose = useCallback(() => {
    setModalField("");
  }, []);

  const closeStatusMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleCreateConversation = useCallback(async () => {
    if (!task.data) return;
    const conv: ConversationInterface = {
      allowAnonymousPosts: false,
      contentType: "task",
      contentId: task.data.id,
      title: "Task #" + task.data.id + " Notes",
      visibility: "hidden",
    };
    const result: ConversationInterface[] = await ApiHelper.post("/conversations", [conv], "MessagingApi");
    const t = { ...task.data };
    t.conversationId = result[0].id;
    updateTaskMutation.mutate(t);
    return t.conversationId;
  }, [task.data, updateTaskMutation]);

  if (task.isLoading) return <Loading />;
  if (!task.data) return <></>;
  else {
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
                <TaskIcon sx={{ fontSize: 32, color: "#FFF" }} />
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
                  #{task.data.taskNumber} - {task.data?.title}
                </Typography>
                <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mt: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Created {DateHelper.getDisplayDuration(DateHelper.toDate(task.data?.dateCreated))} ago by {task.data.createdByLabel}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Associated: {task.data.associatedWithLabel || "Not specified"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Assigned: {task.data.assignedToLabel || "Unassigned"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>

            {/* Right side: Status and Actions */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexShrink: 0,
                justifyContent: { xs: "flex-start", md: "flex-end" },
                width: { xs: "100%", md: "auto" },
              }}
            >
              <Button
                variant={task.data.status === "Open" ? "contained" : "outlined"}
                startIcon={task.data.status === "Open" ? <OpenIcon /> : <CompletedIcon />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  color: task.data.status === "Open" ? "#FFF" : "#FFF",
                  backgroundColor: task.data.status === "Open" ? "#f57c00" : "transparent",
                  borderColor: task.data.status === "Open" ? "#f57c00" : "#4caf50",
                  "&:hover": {
                    backgroundColor: task.data.status === "Open" ? "#ef6c00" : "rgba(76, 175, 80, 0.2)",
                    borderColor: task.data.status === "Open" ? "#ef6c00" : "#4caf50",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {task.data.status}
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PersonIcon />}
                onClick={() => setModalField("assignedTo")}
                sx={{
                  color: "#FFF",
                  borderColor: "rgba(255,255,255,0.5)",
                  minWidth: "auto",
                  "&:hover": {
                    borderColor: "#FFF",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
                title="Edit Assigned To"
              >
                Assign
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<GroupIcon />}
                onClick={() => setModalField("associatedWith")}
                sx={{
                  color: "#FFF",
                  borderColor: "rgba(255,255,255,0.5)",
                  minWidth: "auto",
                  "&:hover": {
                    borderColor: "#FFF",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
                title="Edit Associated With"
              >
                Associate
              </Button>
            </Stack>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeStatusMenu}>
              <MenuItem
                onClick={() => {
                  handleStatusChange("Open");
                  closeStatusMenu();
                }}
              >
                <OpenIcon sx={{ mr: 1 }} /> {Locale.label("tasks.taskPage.open")}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleStatusChange("Closed");
                  closeStatusMenu();
                }}
              >
                <CompletedIcon sx={{ mr: 1 }} /> {Locale.label("tasks.taskPage.closed")}
              </MenuItem>
            </Menu>
          </Stack>
        </Box>

        {/* Task Content */}
        <Box sx={{ p: 3 }}>
          {task.data.taskType === "directoryUpdate" && <RequestedChanges task={task.data} />}
          <Notes context={context} conversationId={task.data?.conversationId} createConversation={handleCreateConversation} />
        </Box>

        {modalField !== "" && <ContentPicker onClose={handleModalClose} onSelect={handleContentPicked} />}
      </>
    );
  }
};
