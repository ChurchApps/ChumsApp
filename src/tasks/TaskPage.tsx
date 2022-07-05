import React from "react";
import { Grid, Icon, Typography } from "@mui/material";
import { ApiHelper, DisplayBox, TaskInterface, NoteInterface, ArrayHelper, Notes, AddNote, DateHelper } from "../components";
import { SmallButton } from "../appBase/components";
import { Link, useParams } from "react-router-dom";

export const TaskPage = () => {
  const editContent = <SmallButton icon="add" onClick={() => { }} />
  const params = useParams();
  const [task, setTask] = React.useState<TaskInterface>(null);
  const [notes, setNotes] = React.useState<NoteInterface[]>(null)
  const [showNoteBox, setShowNoteBox] = React.useState<boolean>(false);
  const [noteId, setNoteId] = React.useState<string>("");

  const loadData = () => { ApiHelper.get("/tasks/" + params.id, "DoingApi").then(data => setTask(data)); }
  React.useEffect(loadData, [params.id]);

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

  const getContentLink = (contentType: string, contentId: string, contentLabel: string) => (<Link to={"/people/" + contentId}>{contentLabel}</Link>)

  if (!task) return <></>
  else return (
    <>
      <h1><Icon>list_alt</Icon> #{task.taskNumber} - {task?.title}</h1>

      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <Notes notes={notes} showNoteBox={handleNotesClick} />
          {showNoteBox && <AddNote contentId={task?.id} noteId={noteId} close={() => setShowNoteBox(false)} updatedFunction={loadNotes} />}
        </Grid>
        <Grid item md={4} xs={12}>
          <DisplayBox headerIcon="list_alt" headerText="Task Details" editContent={editContent}>
            <div><Typography variant="subtitle1">Date Created</Typography></div>
            <div><Typography variant="caption">{DateHelper.prettyDate(DateHelper.convertToDate(task?.dateCreated))}</Typography></div>
            <hr />
            <div><Typography variant="subtitle1">Status</Typography></div>
            <div><Typography variant="caption">{task.status}</Typography></div>
            <hr />
            <div><Typography variant="subtitle1">Created By</Typography></div>
            <div><Typography variant="caption">{getContentLink(task.createdByType, task.createdById, task.createdByLabel)}</Typography></div>
            <hr />
            <div>
              <span style={{ float: "right", paddingTop: 17 }}><SmallButton text="Change" icon="search" /></span>
              <Typography variant="subtitle1">Associated With</Typography>
            </div>
            <div><Typography variant="caption">{getContentLink(task.associatedWithType, task.associatedWithId, task.associatedWithLabel)}</Typography></div>
            <hr />
            <div>
              <span style={{ float: "right", paddingTop: 17 }}><SmallButton text="Change" icon="search" /></span>
              <Typography variant="subtitle1">Assigned to</Typography>
            </div>
            <div><Typography variant="caption">{getContentLink(task.assignedToType, task.assignedToId, task.assignedToLabel)}</Typography></div>
          </DisplayBox>
        </Grid>
      </Grid>
    </>
  );
}
