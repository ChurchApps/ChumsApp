import React from "react";
import { ApiHelper, Note, DisplayBox, InputBox, UserHelper, Permissions } from "./";

interface Props {
  contentId: number;
  contentType: string;
}

export const Notes: React.FC<Props> = (props) => {
  const [notes, setNotes] = React.useState([]);
  const [noteText, setNoteText] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNoteText(e.currentTarget.value);
  const loadNotes = () => {
    if (props.contentId > 0)
      ApiHelper.get(
        "/notes/" + props.contentType + "/" + props.contentId, "MembershipApi"
      ).then((data) => setNotes(data));
  };
  const handleSave = () => {
    var n = {
      contentId: props.contentId,
      contentType: props.contentType,
      contents: noteText,
    };
    ApiHelper.post("/notes", [n], "MembershipApi").then(() => {
      loadNotes();
      setNoteText("");
    });
  };

  React.useEffect(loadNotes, [props.contentId]);

  const handleDelete = (noteId: number) => () => {
    ApiHelper.delete(`/notes/${noteId}`, "MembershipApi");
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  var noteArray: React.ReactNode[] = [];
  for (var i = 0; i < notes.length; i++)
    noteArray.push(
      <Note note={notes[i]} key={notes[i].id} handleDelete={handleDelete} />
    );

  var canEdit = UserHelper.checkAccess(Permissions.membershipApi.people.editNotes);
  if (!canEdit)
    return (
      <DisplayBox headerIcon="far fa-sticky-note" headerText="Notes">
        {noteArray}
      </DisplayBox>
    );
  else
    return (
      <InputBox
        id="notesBox"
        data-cy="notes-box"
        headerIcon="far fa-sticky-note"
        headerText="Notes"
        saveFunction={handleSave}
        saveText="Add Note"
      >
        {noteArray}
        <br />
        <div className="form-group">
          <label>Add a Note</label>
          <textarea
            id="noteText"
            data-cy="enter-note"
            className="form-control"
            name="contents"
            onChange={handleChange}
            value={noteText}
          />
        </div>
      </InputBox>
    );
};
