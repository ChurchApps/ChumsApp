import { Icon } from "@mui/material";
import React from "react";
import { Note, DisplayBox, UserHelper, Permissions, Loading, NoteInterface, MessageInterface, ApiHelper, ArrayHelper, AddNote } from "./";

interface Props {
  //showEditNote: (noteId?: string) => void;
  //notes: NoteInterface[];
  conversationId: string;
  createConversation: () => Promise<string>;
}

export function Notes(props: Props) {

  const [messages, setMessages] = React.useState<MessageInterface[]>(null)

  const loadNotes = async () => {
    const noteData: MessageInterface[] = (props.conversationId) ? await ApiHelper.get("/messages/conversation/" + props.conversationId, "MessagingApi") : [];
    if (noteData.length > 0) {
      const peopleIds = ArrayHelper.getIds(noteData, "personId");
      const people = await ApiHelper.get("/people/ids?ids=" + peopleIds.join(","), "MembershipApi");
      noteData.forEach(n => {
        n.person = ArrayHelper.getOne(people, "id", n.personId);
      })
    }
    setMessages(noteData)
  };

  const handleShowEdit = (messageId: string) => {

  }

  const getNotes = () => {
    if (!messages) return <Loading />
    if (messages.length === 0) return <></>
    else {
      let noteArray: React.ReactNode[] = [];
      for (let i = 0; i < messages.length; i++) noteArray.push(<Note message={messages[i]} key={messages[i].id} showEditNote={handleShowEdit} />);
      return noteArray;
    }
  }

  React.useEffect(() => { loadNotes() }, [props.conversationId]); //eslint-disable-line

  return (
    <DisplayBox id="notesBox" data-cy="notes-box" headerIcon="sticky_note_2" headerText="Notes">
      {getNotes()}
      {messages && (<AddNote conversationId={props.conversationId} onUpdate={loadNotes} createConversation={props.createConversation} />)}
    </DisplayBox>
  );
};
