import React, { useState, useEffect } from "react";
import { PersonHelper, DateHelper, NoteInterface } from "./";

interface Props {
  note: NoteInterface;
  handleDelete: Function;
  updateFunction: () => void;
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

  return (
    <div className="note">
      <div className="postedBy">
        <img src={photoUrl} alt="avatar" />
      </div>
      <div className="w-100">
        <div className="d-flex justify-content-between">
          <div>
            <b>{note.person.name.display}</b> · <span className="text-grey">{displayDuration}{isEdited}</span>
          </div>
          <div>
            <i
              className="fas fa-pencil-alt"
              onClick={() => props.showNoteBox(note.id)}
              style={{ color: "#03a9f4" }}
            ></i>
          </div>
        </div>
        <p>{note.contents?.replace("\n", "<br/>")}</p>
      </div>
    </div>
  );
};
