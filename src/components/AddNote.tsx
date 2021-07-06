import React, { useState, useEffect } from "react";
import { ApiHelper, NoteInterface, InputBox } from ".";

type Props = {
  close: () => void;
  contentId: string,
  noteId?: string
};

export function AddNote({
  close,
  contentId,
  noteId
}: Props) {
  const [note, setNote] = useState<NoteInterface>();
  const headerText = noteId ? "Edit note" : "Add a note"

  useEffect(() => {
    if (!noteId) {
      setNote({})
      return;
    }

    (async () => {
      const note = await ApiHelper.get(`/notes/${noteId}`, "MembershipApi");
      setNote(note);
    })()
  }, [noteId])

  function handleSave() {
    const payload: NoteInterface = {
      contentId: contentId,
      contentType: "person",
      ...note
    }
    ApiHelper.post("/notes", [payload], "MembershipApi").then(() => {
      close();
    });
  };

  return (
    <InputBox
      headerText={headerText}
      headerIcon="far fa-sticky-note"
      saveFunction={handleSave}
      cancelFunction={close}
    >
      <div className="form-group">
        <textarea
          id="noteText"
          data-cy="enter-note"
          className="form-control"
          name="contents"
          style={{height: "100px"}}
          onChange={(e) => setNote({...note, contents: e.target.value})}
          value={note?.contents || ""}
        />
      </div>
    </InputBox>
  );
}
