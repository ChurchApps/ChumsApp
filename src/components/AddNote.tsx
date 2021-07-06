import React, { useState } from "react";
import { ApiHelper, NoteInterface, InputBox } from ".";

type Props = {
  close: () => void;
  contentId: string
};

export function AddNote({
  close,
  contentId
}: Props) {
  const [note, setNote] = useState<NoteInterface>();

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
      headerText="Add a Note"
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
