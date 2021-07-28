import React from "react";
import { Note, DisplayBox, UserHelper, Permissions, Loading, NoteInterface } from "./";

interface Props {
  showNoteBox: (noteId?: string) => void;
  notes: NoteInterface[];
}

export function Notes({ showNoteBox, notes }: Props) {
  const getNotes = () => {
    if (!notes) return <Loading />
    if (notes.length === 0) return <p>Create a Note and they'll start appearing here.</p>
    else {
      let noteArray: React.ReactNode[] = [];
      for (let i = 0; i < notes.length; i++) noteArray.push(<Note note={notes[i]} key={notes[i].id} showNoteBox={showNoteBox} />);
      return noteArray;
    }
  }

  const canEdit = UserHelper.checkAccess(Permissions.membershipApi.notes.edit);
  const editContent = canEdit && (
    <button aria-label="addNote" className="no-default-style" onClick={() => { showNoteBox() }}>
      <i className="fas fa-plus"></i>
    </button>
  )

  return (
    <DisplayBox id="notesBox" data-cy="notes-box" headerIcon="far fa-sticky-note" headerText="Notes" editContent={editContent}>
      {getNotes()}
    </DisplayBox>
  );
};
