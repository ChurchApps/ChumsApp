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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Modern Task Header */}
      <Box sx={{ 
        backgroundColor: 'var(--c1l2)', 
        color: '#FFF', 
        p: 3, 
        borderRadius: 2,
        mb: 3
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} flexWrap="wrap">
          <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0, flex: 1 }}>
            <TaskIcon sx={{ fontSize: 32, flexShrink: 0 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  wordBreak: "break-word"
                }}
              >
                #{task.taskNumber} - {task?.title}
              </Typography>
            </Box>
          </Stack>
          
          <Chip
            icon={task.status === "Open" ? <OpenIcon /> : <CompletedIcon />}
            label={task.status}
            clickable
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              backgroundColor: task.status === "Open" ? "warning.main" : "success.main",
              color: "#FFF",
              fontWeight: 600,
              '&:hover': {
                backgroundColor: task.status === "Open" ? "warning.dark" : "success.dark"
              }
            }}
          />
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

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {task.taskType === "directoryUpdate" && <RequestedChanges task={task} />}
          <Notes context={context} conversationId={task?.conversationId} createConversation={handleCreateConversation} />
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <CardContent>
              <Stack spacing={3}>
                {/* Task Details Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {Locale.label("tasks.taskPage.taskDet")}
                  </Typography>
                </Box>

                <Divider />

                {/* Date Information */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <CalendarIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {Locale.label("tasks.taskPage.dateCreated")}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {DateHelper.prettyDate(DateHelper.toDate(task?.dateCreated))}
                  </Typography>
                  
                  {task?.dateClosed && (
                    <Box sx={{ mt: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <CompletedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Date Closed
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {DateHelper.prettyDate(DateHelper.toDate(task?.dateClosed))}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider />

                {/* Created By */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <PersonIcon sx={{ color: 'info.main', fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {Locale.label("tasks.taskPage.createdBy")}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {getContentLink(task.createdByType, task.createdById, task.createdByLabel)}
                  </Typography>
                </Box>

                <Divider />

                {/* Associated With */}
                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <GroupIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {Locale.label("tasks.taskPage.associateW")}
                      </Typography>
                    </Stack>
                    <IconButton 
                      size="small" 
                      onClick={() => setModalField("associatedWith")}
                      data-testid="change-associated-with-button"
                      aria-label="Change associated with"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {getContentLink(task.associatedWithType, task.associatedWithId, task.associatedWithLabel)}
                  </Typography>
                </Box>

                <Divider />

                {/* Assigned To */}
                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PersonIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {Locale.label("tasks.taskPage.assignTo")}
                      </Typography>
                    </Stack>
                    <IconButton 
                      size="small" 
                      onClick={() => setModalField("assignedTo")}
                      data-testid="change-assigned-to-button"
                      aria-label="Change assigned to"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {getContentLink(task.assignedToType, task.assignedToId, task.assignedToLabel)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {(modalField !== "") && <ContentPicker onClose={handleModalClose} onSelect={handleContentPicked} />}
    </Container>
  );
}
