import React, { useState, useEffect } from "react";
import { NoteInterface, PersonInterface } from "../helpers";
import { ApiHelper, Note, DisplayBox, UserHelper, Permissions, UniqueIdHelper, Loading } from "./";

interface Props {
  person: PersonInterface;
  contentType: string;
  showNoteBox: (noteId?: string) => void
}

export const Notes: React.FC<Props> = (props) => {
  const [notes, setNotes] = useState(null);

  const loadNotes = () => {
    if (!UniqueIdHelper.isMissing(props.person?.id))
      ApiHelper.get(
        "/notes/" + props.contentType + "/" + props.person?.id, "MembershipApi"
      ).then((data) => setNotes(data));
  };

  useEffect(loadNotes, [props]);

  const handleDelete = (noteId: string) => () => {
    ApiHelper.delete(`/notes/${noteId}`, "MembershipApi");
    setNotes(notes.filter((note: NoteInterface) => note.id !== noteId));
  };

  const getNotes = () => {
    if (!notes) return <Loading />
    if (notes.length === 0) return <p>Create a Note and they'll start appearing here.</p>
    else {
      let noteArray: React.ReactNode[] = [];
      for (let i = 0; i < notes.length; i++) noteArray.push(<Note note={notes[i]} key={notes[i].id} handleDelete={handleDelete} updateFunction={loadNotes} showNoteBox={props.showNoteBox} />);
      return noteArray;
    }
  }

  const canEdit = UserHelper.checkAccess(Permissions.membershipApi.notes.edit);
  const editContent = canEdit && (
    <button aria-label="addNote" className="no-default-style" onClick={() => { props.showNoteBox() }}>
      <i className="fas fa-plus"></i>
    </button>
  )

  return (
    <DisplayBox id="notesBox" data-cy="notes-box" headerIcon="far fa-sticky-note" headerText="Notes" editContent={editContent}>
      {getNotes()}
    </DisplayBox>
  );
};
