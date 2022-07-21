import React, { useState, useEffect } from "react"
import { ApiHelper, NoteInterface, InputBox, ApiListType } from "."
import { TextField } from "@mui/material"
import { ErrorMessages } from "../appBase/components"

type Props = {
  close: () => void;
  contentId: string;
  noteId?: string;
  updatedFunction: () => void;
  apiName?: ApiListType;
  contentType?: string;
};

export function AddNote(props: Props) {
  const [note, setNote] = useState<NoteInterface>()
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const headerText = props.noteId ? "Edit note" : "Add a note"

  useEffect(() => {
    if (props.noteId) ApiHelper.get(`/notes/${props.noteId}`, props.apiName || "MembershipApi").then(n => setNote(n));
    else setNote({ contentId: props.contentId, contentType: props.contentType || "person", contents: "" });
    return () => {
      setNote(null);
    };
  }, [props.noteId, props.apiName, props.contentId, props.contentType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const n = { ...note } as NoteInterface;
    n.contents = e.target.value;
    setNote(n);
  }

  const validate = () => {
    const result = [];
    if (!note.contents.trim()) result.push("Please enter a note.");
    setErrors(result);
    return result.length === 0;
  }

  async function handleSave() {
    if (validate()) {
      setIsSubmitting(true);
      ApiHelper.post("/notes", [note], props.apiName || "MembershipApi")
        .then(() => { props.close(); props.updatedFunction() })
        .finally(() => { setIsSubmitting(false) });
    }
  };

  async function deleteNote() {
    await ApiHelper.delete(`/notes/${props.noteId}`, props.apiName || "MembershipApi")
    props.updatedFunction()
    props.close();
  }

  const deleteFunction = props.noteId ? deleteNote : null;

  return (
    <InputBox headerText={headerText} headerIcon="sticky_note_2" saveFunction={handleSave} cancelFunction={props.close} deleteFunction={deleteFunction} isSubmitting={isSubmitting}>
      <ErrorMessages errors={errors} />
      <TextField fullWidth multiline name="noteText" aria-label={headerText} style={{ height: "100px" }} onChange={handleChange} value={note?.contents} InputLabelProps={{ shrink: !!note?.contents }} label="Some note..." />
    </InputBox>
  );
}
