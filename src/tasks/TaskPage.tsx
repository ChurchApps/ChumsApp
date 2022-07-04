import React from "react";
import { Grid, Icon, InputAdornment, TextField, Typography } from "@mui/material";
import { ApiHelper, DisplayBox, TaskInterface, NoteInterface, ArrayHelper, Notes, AddNote } from "../components";
import { SmallButton } from "../appBase/components";
import { useParams } from "react-router-dom";

export const TaskPage = () => {
  const editContent = <SmallButton icon="add" onClick={() => { }} />
  const params = useParams();
  const [task, setTask] = React.useState<TaskInterface>(null);
  const [notes, setNotes] = React.useState<NoteInterface[]>(null)
  const [showNoteBox, setShowNoteBox] = React.useState<boolean>(false);
  const [noteId, setNoteId] = React.useState<string>("");

  const loadData = () => { ApiHelper.get("/tasks/" + params.id, "DoingApi").then(data => setTask(data)); }

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

  return (
    <>
      <h1><Icon>list_alt</Icon> {task?.title}</h1>

      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox headerIcon="list_alt" headerText="Task Details" editContent={editContent}>
            {task?.status}

          </DisplayBox>
          <Notes notes={notes} showNoteBox={handleNotesClick} />
          {showNoteBox && <AddNote contentId={task?.id} noteId={noteId} close={() => setShowNoteBox(false)} updatedFunction={loadNotes} />}
        </Grid>
        <Grid item md={4} xs={12}>
          <DisplayBox headerIcon="list_alt" headerText="Task Details" editContent={editContent}>
            <div><Typography variant="subtitle1">Date Created</Typography></div>
            <div><Typography variant="caption">2022-07-01</Typography></div>
            <hr />
            <div><Typography variant="subtitle1">Associated With</Typography></div>
            <div><Typography variant="caption">Jeremy Zongker</Typography></div>
            <hr />
            <div><Typography variant="subtitle1">Created By</Typography></div>
            <div><Typography variant="caption">Jeremy Zongker</Typography></div>
            <hr />
            <div><Typography variant="subtitle1">Assigned to</Typography></div>
            <div><Typography variant="caption">Jeremy Zongker</Typography></div>
          </DisplayBox>
        </Grid>
      </Grid>
    </>
  );
}
