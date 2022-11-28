import { Icon, IconButton, Stack, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { PersonHelper, DateHelper, MessageInterface } from "./";

interface Props {
  //note: NoteInterface;
  message: MessageInterface;
  showEditNote: (noteId?: string) => void
}

export const Note: React.FC<Props> = (props) => {
  const [message, setMessage] = useState<MessageInterface>(null);

  useEffect(() => setMessage(props.message), [props.message]);

  if (message === null) return null;
  const photoUrl = PersonHelper.getPhotoUrl(message.person);
  let datePosted = new Date(message.timeUpdated || message.timeSent);
  const displayDuration = DateHelper.getDisplayDuration(datePosted);

  const isEdited = message.timeUpdated && message.timeUpdated !== message.timeSent && <>(edited)</>;
  const contents = message.content?.split("\n");
  return (
    <div className="note">
      <div className="postedBy">
        <img src={photoUrl} alt="avatar" />
      </div>
      <Box sx={{ width: "100%" }} className="note-contents">
        <Stack direction="row" justifyContent="space-between">
          <div>
            <b>{message.person?.name?.display}</b> · <span className="text-grey">{displayDuration}{isEdited}</span>
            {contents.map((c, i) => c ? <p key={i}>{c}</p> : <br />)}
          </div>
          <div>
            <IconButton aria-label="editNote" onClick={() => props.showEditNote(message.id)}>
              <Icon style={{ color: "#03a9f4" }}>edit</Icon>
            </IconButton>
          </div>
        </Stack>

      </Box>
    </div>
  );
};
