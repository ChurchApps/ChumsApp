import React from "react";
import { PersonHelper, ApiHelper, DateHelper, NoteInterface, InputBox } from "./";

interface Props {
  note: NoteInterface;
  handleDelete: Function;
  updateFunction: () => void;
  showNoteBox: (noteId?: string) => void
}

export const Note: React.FC<Props> = (props) => {
  const [note, setNote] = React.useState<NoteInterface>(null);
  const [showEdit, setShowEdit] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNote({ ...note, contents: e.currentTarget.value });

  React.useEffect(() => setNote(props.note), [props.note]);

  if (note === null) return null;
  const photoUrl = PersonHelper.getPhotoUrl(note.person);
  let datePosted = new Date(note.updatedAt);
  const displayDuration = DateHelper.getDisplayDuration(datePosted);

  const handleSave = () => {
    ApiHelper.post("/notes", [note], "MembershipApi").then(() => {
      setShowEdit(false);
      props.updateFunction();
    });
  };

  const handleCancel = () => {
    setShowEdit(false);
  };

  const isEdited = note.updatedAt !== note.createdAt && <>(edited)</>;

  return (
    <div className="note">
      {showEdit ? (
        <InputBox
          id="notesBox"
          headerIcon="far fa-edit"
          headerText="Edit note"
          saveFunction={handleSave}
          deleteFunction={props.handleDelete(note.id)}
          cancelFunction={handleCancel}
          saveText="Save"
          className="w-100"
        >
          <div className="form-group">
            <textarea
              id="noteText"
              className="form-control"
              name="contents"
              onChange={handleChange}
              value={note.contents}
            />
          </div>
        </InputBox>
      ) : (
        <>
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
            <p>{note.contents.replace("\n", "<br/>")}</p>
          </div>
        </>
      )}
    </div>
  );
};
