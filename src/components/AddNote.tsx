import React, { useState, useEffect } from "react"
import { Form } from "react-bootstrap"
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"
import { ApiHelper, NoteInterface, InputBox } from "."

const schema = yup.object().shape({
  noteText: yup.string().required("Please enter a note.")
})

type Props = {
  close: () => void;
  contentId: string;
  noteId?: string;
  updatedFunction: () => void;
};

export function AddNote({
  close,
  contentId,
  noteId,
  updatedFunction
}: Props) {
  const [note, setNote] = useState<NoteInterface>()
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

  async function handleSave({ noteText }: { noteText: string }, { setSubmitting }: FormikHelpers<any>) {
    const payload: NoteInterface = {
      contentId: contentId,
      contentType: "person",
      ...note,
      contents: noteText
    }
    ApiHelper.post("/notes", [payload], "MembershipApi").then(() => {
      close();
      updatedFunction()
    }).finally(() => {
      setSubmitting(false)
    });
  };

  async function deleteNote() {
    await ApiHelper.delete(`/notes/${noteId}`, "MembershipApi")
    updatedFunction()
    close();
  }

  const deleteFunction = noteId ? deleteNote : null;

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSave}
      initialValues={{ noteText: note?.contents || "" }}
      enableReinitialize={true}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
        isSubmitting
      }) => (
        <Form noValidate>
          <InputBox
            headerText={headerText}
            headerIcon="sticky_note_2"
            saveFunction={handleSubmit}
            cancelFunction={close}
            deleteFunction={deleteFunction}
            isSubmitting={isSubmitting}
          >
            <Form.Group>
              <Form.Control
                type="text"
                as="textarea"
                name="noteText"
                aria-label={headerText}
                style={{ height: "100px" }}
                onChange={handleChange}
                value={values.noteText}
                placeholder="Some note..."
                isInvalid={touched.noteText && !!errors.noteText}
              />
              <Form.Control.Feedback type="invalid">
                {errors.noteText}
              </Form.Control.Feedback>
            </Form.Group>
          </InputBox>
        </Form>
      )}
    </Formik>
  );
}
