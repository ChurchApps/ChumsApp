import React, { useState, useEffect } from "react"
import { ApiHelper, MessageInterface } from "."
import { TextField } from "@mui/material"
import { ErrorMessages } from "../appBase/components"

type Props = {
  messageId?: string;
  updatedFunction: () => void;
  conversationId?: string;
};

export function AddNote(props: Props) {
  const [message, setMessage] = useState<MessageInterface>()
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const headerText = props.messageId ? "Edit note" : "Add a note"

  useEffect(() => {
    if (props.messageId) ApiHelper.get(`/messages/${props.messageId}`, "MessagingApi").then(n => setMessage(n));
    else setMessage({ conversationId: props.conversationId, content: "" });
    return () => {
      setMessage(null);
    };
  }, [props.messageId, props.conversationId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const m = { ...message } as MessageInterface;
    m.content = e.target.value;
    setMessage(m);
  }

  const validate = () => {
    const result = [];
    if (!message.content.trim()) result.push("Please enter a note.");
    setErrors(result);
    return result.length === 0;
  }

  async function handleSave() {
    if (validate()) {
      setIsSubmitting(true);
      ApiHelper.post("/messages", [message], "MessagingApi")
        .then(() => { props.updatedFunction() })
        .finally(() => { setIsSubmitting(false) });
    }
  };

  async function deleteNote() {
    await ApiHelper.delete(`/messages/${props.messageId}`, "MessagingApi")
    props.updatedFunction()
  }

  const deleteFunction = props.messageId ? deleteNote : null;

  return (
    <>
      <ErrorMessages errors={errors} />
      <TextField fullWidth multiline name="noteText" aria-label={headerText} style={{ height: "100px" }} onChange={handleChange} value={message?.content} InputLabelProps={{ shrink: !!message?.content }} label="Add a note..." />
    </>
  );
}
