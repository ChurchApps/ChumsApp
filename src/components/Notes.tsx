import React, { useState } from "react";
import { NoteInterface, PersonInterface } from "../helpers";
import { ApiHelper, Note, DisplayBox, InputBox, UserHelper, Permissions, UniqueIdHelper, ErrorMessages, Loading } from "./";
import { Row, Col, Button } from "react-bootstrap";

interface Props {
  person: PersonInterface;
  contentType: string;
  showNoteBox: () => void
}

export const Notes: React.FC<Props> = (props) => {
  const [notes, setNotes] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [errors, setErrors] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNoteText(e.currentTarget.value);
  const loadNotes = () => {
    if (!UniqueIdHelper.isMissing(props.person?.id))
      ApiHelper.get(
        "/notes/" + props.contentType + "/" + props.person?.id, "MembershipApi"
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
      contentId: props.person?.id,
      contentType: props.contentType,
      contents: noteText
    };
    ApiHelper.post("/notes", [n], "MembershipApi").then(() => {
      loadNotes();
      setNoteText("");
    });
  };

  React.useEffect(loadNotes, [props]);

  const handleDelete = (noteId: string) => () => {
    ApiHelper.delete(`/notes/${noteId}`, "MembershipApi");
    setNotes(notes.filter((note: NoteInterface) => note.id !== noteId));
  };

  const getNotes = () => {
    if (!notes) return <Loading />
    else {
      let noteArray: React.ReactNode[] = [];
      for (let i = 0; i < notes.length; i++) noteArray.push(<Note note={notes[i]} key={notes[i].id} handleDelete={handleDelete} updateFunction={loadNotes} showNoteBox={props.showNoteBox} />);
      return noteArray;
    }
  }

  const canEdit = UserHelper.checkAccess(Permissions.membershipApi.notes.edit);
  const editContent = canEdit && (
    <a href="about:blank" data-cy="add-button" onClick={(e: React.MouseEvent) => { e.preventDefault(); props.showNoteBox() }}>
      <i className="fas fa-plus"></i>
    </a>
  )

  return (
    <DisplayBox id="notesBox" data-cy="notes-box" headerIcon="far fa-sticky-note" headerText="Notes" editContent={editContent}>
      {getNotes()}
    </DisplayBox>
  );
};
