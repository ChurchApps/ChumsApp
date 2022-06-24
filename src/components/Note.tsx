import { Icon, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { PersonHelper, DateHelper, NoteInterface } from "./";

interface Props {
  note: NoteInterface;
  showNoteBox: (noteId?: string) => void
}

export const Note: React.FC<Props> = (props) => {
  const [note, setNote] = useState<NoteInterface>(null);

  useEffect(() => setNote(props.note), [props.note]);

  if (note === null) return null;
  const photoUrl = PersonHelper.getPhotoUrl(note.person);
  let datePosted = new Date(note.updatedAt);
  const displayDuration = DateHelper.getDisplayDuration(datePosted);

  const isEdited = note.updatedAt !== note.createdAt && <>(edited)</>;
  const contents = note.contents?.split("\n");
  return (
    <div className="note">
      <div className="postedBy">
        <img src={photoUrl} alt="avatar" />
      </div>
      <div className="w-100 note-contents">
        <div className="d-flex justify-content-between">
          <div>
            <b>{note.person.name.display}</b> · <span className="text-grey">{displayDuration}{isEdited}</span>
          </div>
          <div>
            <IconButton aria-label="editNote" onClick={() => props.showNoteBox(note.id)}>
              <Icon style={{ color: "#03a9f4" }}>edit</Icon>
            </IconButton>
          </div>
        </div>
        {contents.map((c, i) => c ? <p key={i}>{c}</p> : <br />)}
      </div>
    </div>
  );
};
