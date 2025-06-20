import React, { useContext } from "react";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import { ApiHelper, DisplayBox, TaskInterface, Notes, DateHelper, ConversationInterface, Locale } from "@churchapps/apphelper";
import { SmallButton } from "@churchapps/apphelper";
import { Link, useParams } from "react-router-dom";
import { ContentPicker } from "./components/ContentPicker";
import UserContext from "../UserContext";
import { RequestedChanges } from "./components/RequestedChanges";
import { Banner } from "@churchapps/apphelper";

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
      <Banner><h1>#{task.taskNumber} - {task?.title}</h1></Banner>
      <div id="mainContent">
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            {task.taskType === "directoryUpdate" && <RequestedChanges task={task} />}
            <Notes context={context} conversationId={task?.conversationId} createConversation={handleCreateConversation} />
          </Grid>
          <Grid item md={4} xs={12}>
            <DisplayBox headerIcon="list_alt" headerText={Locale.label("tasks.taskPage.taskDet")} help="chums/tasks">
              <div><Typography variant="subtitle1">{Locale.label("tasks.taskPage.dateCreated")}</Typography></div>
              <div><Typography variant="caption">{DateHelper.prettyDate(DateHelper.toDate(task?.dateCreated))}</Typography></div>
              <hr />
              {getDateClosed()}
              <div><Typography variant="subtitle1">{Locale.label("tasks.taskPage.stat")}</Typography></div>
              <div>
                <Typography variant="caption"><a href="about:blank" onClick={(e) => { e.preventDefault(); setAnchorEl(e.currentTarget); }}>{task.status}</a></Typography>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeStatusMenu}>
                  <MenuItem onClick={() => { handleStatusChange("Open"); closeStatusMenu() }}>{Locale.label("tasks.taskPage.open")}</MenuItem>
                  <MenuItem onClick={() => { handleStatusChange("Closed"); closeStatusMenu() }}>{Locale.label("tasks.taskPage.closed")}</MenuItem>
                </Menu>
              </div>
              <hr />
              <div><Typography variant="subtitle1">{Locale.label("tasks.taskPage.createdBy")}</Typography></div>
              <div><Typography variant="caption">{getContentLink(task.createdByType, task.createdById, task.createdByLabel)}</Typography></div>
              <hr />
              <div>
                <span style={{ float: "right", paddingTop: 17 }}><SmallButton text={Locale.label("tasks.taskPage.change")} icon="search" onClick={() => { setModalField("associatedWith") }} /></span>
                <Typography variant="subtitle1">{Locale.label("tasks.taskPage.associateW")}</Typography>
              </div>
              <div><Typography variant="caption">{getContentLink(task.associatedWithType, task.associatedWithId, task.associatedWithLabel)}</Typography></div>
              <hr />
              <div>
                <span style={{ float: "right", paddingTop: 17 }}><SmallButton text={Locale.label("tasks.taskPage.change")} icon="search" onClick={() => { setModalField("assignedTo") }} /></span>
                <Typography variant="subtitle1">{Locale.label("tasks.taskPage.assignTo")}</Typography>
              </div>
              <div><Typography variant="caption">{getContentLink(task.assignedToType, task.assignedToId, task.assignedToLabel)}</Typography></div>
            </DisplayBox>
          </Grid>
        </Grid>
        {(modalField !== "") && <ContentPicker onClose={handleModalClose} onSelect={handleContentPicked} />}
      </div>
    </>
  );
}
