import React, { useContext } from "react";
import { 
  Grid, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Stack, 
  Chip, 
  Button, 
  IconButton, 
  Divider 
} from "@mui/material";
import { ApiHelper, type TaskInterface, Notes, DateHelper, type ConversationInterface, Locale } from "@churchapps/apphelper";
import { Link, useParams } from "react-router-dom";
import { ContentPicker } from "./components/ContentPicker";
import UserContext from "../UserContext";
import { RequestedChanges } from "./components/RequestedChanges";
import {
  Assignment as TaskIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as OpenIcon
} from "@mui/icons-material";

export const TaskPage = () => {
  const params = useParams();
  const [task, setTask] = React.useState<TaskInterface>(null);
  const [modalField, setModalField] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const context = useContext(UserContext);

  const loadData = () => { ApiHelper.get("/tasks/" + params.id, "DoingApi").then(data => setTask(data)); }

  React.useEffect(loadData, [params.id]);

  const handleContentPicked = (contentType: string, contentId: string, label: string) => {
    const t = { ...task };
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
    ApiHelper.post("/tasks", [t], "DoingApi");
    setTask(t);
    setModalField("")
  }

  const handleStatusChange = (status: string) => {
    const t = { ...task };
    t.status = status;
    t.dateClosed = (status === "Open") ? null : new Date();
    ApiHelper.post("/tasks", [t], "DoingApi");
    setTask(t);
    closeStatusMenu();
  }

  const handleModalClose = () => { setModalField(""); }
  const closeStatusMenu = () => { setAnchorEl(null); }

  const getContentLink = (contentType: string, contentId: string, contentLabel: string) => {
    if (contentType === "system") return <span>{contentLabel}</span>
    else if (contentType === "group") return <Link to={"/groups/" + contentId}>{contentLabel}</Link>
    else return <Link to={"/people/" + contentId}>{contentLabel}</Link>
  }

  const getDateClosed = () => {
    if (task?.dateClosed) return (<>
      <div><Typography variant="subtitle1">{Locale.label("tasks.taskPage.dateCreated")}</Typography></div>
      <div><Typography variant="caption">{DateHelper.prettyDate(DateHelper.toDate(task?.dateCreated))}</Typography></div>
      <hr />
    </>);
  }

  const handleCreateConversation = async () => {
    const conv: ConversationInterface = { allowAnonymousPosts: false, contentType: "task", contentId: task.id, title: "Task #" + task.id + " Notes", visibility: "hidden" }
    const result: ConversationInterface[] = await ApiHelper.post("/conversations", [conv], "MessagingApi");
    const t = { ...task };
    t.conversationId = result[0].id;
    ApiHelper.post("/tasks", [t], "DoingApi");
    setTask(t);
    return t.conversationId;

  }

  if (!task) return <></>
  else return (
    <>
      {/* Modern Blue Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={{ xs: 2, md: 4 }} 
          alignItems={{ xs: "flex-start", md: "center" }} 
          sx={{ width: "100%" }}
        >
          {/* Left side: Title and Icon */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '12px', 
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TaskIcon sx={{ fontSize: 32, color: '#FFF' }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontSize: { xs: '1.75rem', md: '2.125rem' }
                }}
              >
                #{task.taskNumber} - {task?.title}
              </Typography>
              <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Created {DateHelper.getDisplayDuration(DateHelper.toDate(task?.dateCreated))} ago by {task.createdByLabel}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Associated: {task.associatedWithLabel || 'Not specified'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Assigned: {task.assignedToLabel || 'Unassigned'}
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
              width: { xs: "100%", md: "auto" }
            }}
          >
            <Button
              variant={task.status === "Open" ? "contained" : "outlined"}
              startIcon={task.status === "Open" ? <OpenIcon /> : <CompletedIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                color: task.status === "Open" ? '#FFF' : '#FFF',
                backgroundColor: task.status === "Open" ? '#f57c00' : 'transparent',
                borderColor: task.status === "Open" ? '#f57c00' : '#4caf50',
                '&:hover': {
                  backgroundColor: task.status === "Open" ? '#ef6c00' : 'rgba(76, 175, 80, 0.2)',
                  borderColor: task.status === "Open" ? '#ef6c00' : '#4caf50'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {task.status}
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonIcon />}
              onClick={() => setModalField("assignedTo")}
              sx={{
                color: '#FFF',
                borderColor: 'rgba(255,255,255,0.5)',
                minWidth: 'auto',
                '&:hover': {
                  borderColor: '#FFF',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
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
                color: '#FFF',
                borderColor: 'rgba(255,255,255,0.5)',
                minWidth: 'auto',
                '&:hover': {
                  borderColor: '#FFF',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
              title="Edit Associated With"
            >
              Associate
            </Button>
          </Stack>
          
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeStatusMenu}>
            <MenuItem onClick={() => { handleStatusChange("Open"); closeStatusMenu() }}>
              <OpenIcon sx={{ mr: 1 }} /> {Locale.label("tasks.taskPage.open")}
            </MenuItem>
            <MenuItem onClick={() => { handleStatusChange("Closed"); closeStatusMenu() }}>
              <CompletedIcon sx={{ mr: 1 }} /> {Locale.label("tasks.taskPage.closed")}
            </MenuItem>
          </Menu>
        </Stack>
      </Box>

      {/* Task Content */}
      <Box sx={{ p: 3 }}>
        {task.taskType === "directoryUpdate" && <RequestedChanges task={task} />}
        <Notes context={context} conversationId={task?.conversationId} createConversation={handleCreateConversation} />
      </Box>
      
      {(modalField !== "") && <ContentPicker onClose={handleModalClose} onSelect={handleContentPicked} />}
    </>
  );
}
