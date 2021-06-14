import React, { useState } from "react";
import { NoteInterface } from "../helpers";
import { ApiHelper, Note, DisplayBox, InputBox, UserHelper, Permissions, UniqueIdHelper, ErrorMessages, Loading } from "./";

interface Props {
  contentId: string;
  contentType: string;
}

export const Notes: React.FC<Props> = (props) => {
  const [notes, setNotes] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [errors, setErrors] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNoteText(e.currentTarget.value);
  const loadNotes = () => {
    if (!UniqueIdHelper.isMissing(props.contentId))
      ApiHelper.get(
        "/notes/" + props.contentType + "/" + props.contentId, "MembershipApi",
      ).then((data) => setNotes(data));
  };
  const handleSave = () => {
    const errors: string[] = [];
    if (!noteText.trim()) errors.push("Enter some text for note.")

    if (errors.length > 0) {
      setErrors(errors);
      setNoteText("");
      return;
    }

    setErrors([]);
    let n = {
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

  const handleDelete = (noteId: string) => () => {
    ApiHelper.delete(`/notes/${noteId}`, "MembershipApi");
    setNotes(notes.filter((note: NoteInterface) => note.id !== noteId));
  };

  const getNotes = () => {
    if (!notes) return <Loading />
    else {
      let noteArray: React.ReactNode[] = [];
      for (let i = 0; i < notes.length; i++) noteArray.push(<Note note={notes[i]} key={notes[i].id} handleDelete={handleDelete} updateFunction={loadNotes} />);
      return noteArray;
    }
  }

  let canEdit = UserHelper.checkAccess(Permissions.membershipApi.notes.edit);
  if (!canEdit)
    return (
      <DisplayBox headerIcon="far fa-sticky-note" headerText="Notes">
        {getNotes()}
      </DisplayBox>
    );
  else
    return (
      <InputBox id="notesBox" data-cy="notes-box" headerIcon="far fa-sticky-note" headerText="Notes" saveFunction={handleSave} saveText="Add Note">
        {getNotes()}
        <br />
        <ErrorMessages errors={errors} />
        <div className="form-group">
          <label>Add a Note</label>
          <textarea id="noteText" data-cy="enter-note" className="form-control" name="contents" onChange={handleChange} value={noteText} />
        </div>
      </InputBox>
    );
};
