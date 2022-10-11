import React from "react";
import { Grid, Icon, Menu, MenuItem, Typography } from "@mui/material";
import { ApiHelper, DisplayBox, TaskInterface, NoteInterface, ArrayHelper, Notes, AddNote, DateHelper } from "../components";
import { SmallButton } from "../appBase/components";
import { Link, useParams } from "react-router-dom";
import { ContentPicker } from "./components/ContentPicker";

export const TaskPage = () => {
  const params = useParams();
  const [task, setTask] = React.useState<TaskInterface>(null);
  const [notes, setNotes] = React.useState<NoteInterface[]>(null)
  const [showNoteBox, setShowNoteBox] = React.useState<boolean>(false);
  const [noteId, setNoteId] = React.useState<string>("");
  const [modalField, setModalField] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const loadData = () => { ApiHelper.get("/tasks/" + params.id, "DoingApi").then(data => setTask(data)); }

  React.useEffect(loadData, [params.id]);
  React.useEffect(() => { loadNotes() }, [task?.id]); //eslint-disable-line

  const loadNotes = async () => {
    const noteData: NoteInterface[] = await ApiHelper.get("/notes/task/" + task?.id, "DoingApi");
    if (noteData.length > 0) {
      const peopleIds = ArrayHelper.getIds(noteData, "addedBy");
      const people = await ApiHelper.get("/people/ids?ids=" + peopleIds.join(","), "MembershipApi");
      noteData.forEach(n => {
        n.person = ArrayHelper.getOne(people, "id", n.addedBy);
      })
    }
    setNotes(noteData)
  };

  const handleNotesClick = (noteId?: string) => {
    setNoteId(noteId);
    setShowNoteBox(true);
  }

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
      <div><Typography variant="subtitle1">Date Created</Typography></div>
      <div><Typography variant="caption">{DateHelper.prettyDate(DateHelper.convertToDate(task?.dateCreated))}</Typography></div>
      <hr />
    </>);
  }

  if (!task) return <></>
  else return (
    <>
      <h1><Icon>list_alt</Icon> #{task.taskNumber} - {task?.title}</h1>

      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <Notes notes={notes} showNoteBox={handleNotesClick} />
          {showNoteBox && <AddNote apiName="DoingApi" contentType="task" contentId={task?.id} noteId={noteId} close={() => setShowNoteBox(false)} updatedFunction={loadNotes} />}
        </Grid>
        <Grid item md={4} xs={12}>
          <DisplayBox headerIcon="list_alt" headerText="Task Details">
            <div><Typography variant="subtitle1">Date Created</Typography></div>
            <div><Typography variant="caption">{DateHelper.prettyDate(DateHelper.convertToDate(task?.dateCreated))}</Typography></div>
            <hr />
            {getDateClosed()}
            <div><Typography variant="subtitle1">Status</Typography></div>
            <div>
              <Typography variant="caption"><a href="about:blank" onClick={(e) => { e.preventDefault(); setAnchorEl(e.currentTarget); }}>{task.status}</a></Typography>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeStatusMenu}>
                <MenuItem onClick={() => { handleStatusChange("Open"); closeStatusMenu() }}>Open</MenuItem>
                <MenuItem onClick={() => { handleStatusChange("Closed"); closeStatusMenu() }}>Closed</MenuItem>
              </Menu>
            </div>
            <hr />
            <div><Typography variant="subtitle1">Created By</Typography></div>
            <div><Typography variant="caption">{getContentLink(task.createdByType, task.createdById, task.createdByLabel)}</Typography></div>
            <hr />
            <div>
              <span style={{ float: "right", paddingTop: 17 }}><SmallButton text="Change" icon="search" onClick={() => { setModalField("associatedWith") }} /></span>
              <Typography variant="subtitle1">Associated With</Typography>
            </div>
            <div><Typography variant="caption">{getContentLink(task.associatedWithType, task.associatedWithId, task.associatedWithLabel)}</Typography></div>
            <hr />
            <div>
              <span style={{ float: "right", paddingTop: 17 }}><SmallButton text="Change" icon="search" onClick={() => { setModalField("assignedTo") }} /></span>
              <Typography variant="subtitle1">Assigned to</Typography>
            </div>
            <div><Typography variant="caption">{getContentLink(task.assignedToType, task.assignedToId, task.assignedToLabel)}</Typography></div>
          </DisplayBox>
        </Grid>
      </Grid>
      {(modalField !== "") && <ContentPicker onClose={handleModalClose} onSelect={handleContentPicked} />}
    </>
  );
}
