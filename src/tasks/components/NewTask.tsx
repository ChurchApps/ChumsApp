import { Grid, Icon, TextField } from "@mui/material";
import React from "react";
import { ApiHelper, ArrayHelper, ConversationInterface, MessageInterface, TaskInterface, UserHelper } from "@churchapps/apphelper";
import { ErrorMessages, InputBox } from "@churchapps/apphelper";
import { ContentPicker } from "./ContentPicker";
import { useAppTranslation } from "../../contexts/TranslationContext";

interface Props {
  onCancel: () => void,
  onSave: () => void,
  compact?: boolean
}

export const NewTask = (props: Props) => {
  const initialData = {
    status: "Open",
    createdByType: "person",
    createdById: UserHelper.person?.id,
    createdByLabel: UserHelper.person?.name?.display,
    dateCreated: new Date(),
    associatedWithType: "person",
    associatedWithId: UserHelper.person?.id,
    associatedWithLabel: UserHelper.person?.name?.display
  }
  const [task, setTask] = React.useState<TaskInterface>(initialData);
  const [message, setMessage] = React.useState<MessageInterface>({});
  const [modalField, setModalField] = React.useState("");
  const [errors, setErrors] = React.useState([]);
  const { t } = useAppTranslation();

  const validate = () => {
    const result = [];
    if (!task.associatedWithId) result.push(t("tasks.newTask.associatePers"));
    if (!task.assignedToId) result.push(t("tasks.newTask.assignPers"));
    if (!task.title?.trim()) result.push(t("tasks.newTask.titleTask"));
    setErrors(result);
    return result.length === 0;
  }

  const sendNotification = async (task: TaskInterface) => {
    const type = task.assignedToType;
    const id = task.assignedToId;
    let data: any = { peopleIds: [id], contentType: "task", contentId: task.id, message: `New Task Assignment: ${task.title}` };

    if (type === "group") {
      const groupMembers = await ApiHelper.get("/groupmembers?groupId=" + task.assignedToId.toString(), "MembershipApi");
      const ids = ArrayHelper.getIds(groupMembers, "personId");
      data.peopleIds = ids;
    }

    await ApiHelper.post("/notifications/create", data, "MessagingApi");
  }

  const handleSave = async () => {
    if (validate()) {
      const tasks = await ApiHelper.post("/tasks", [task], "DoingApi");
      if (message.content && (message.content?.trim() !== undefined || message.content?.trim() !== "")) {

        const conv: ConversationInterface = { allowAnonymousPosts: false, contentType: "task", contentId: task.id, title: "Task #" + tasks[0].id + " Notes", visibility: "hidden" }
        const result: ConversationInterface[] = await ApiHelper.post("/conversations", [conv], "MessagingApi");
        const t = { ...tasks[0] };
        t.conversationId = result[0].id;
        ApiHelper.post("/tasks", [t], "DoingApi");

        message.conversationId = t.conversationId;
        //message.contentId = tasks[0].id;
        await ApiHelper.post("/messages", [message], "MessagingApi");
      }
      await sendNotification(tasks[0]);
      props.onSave();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;

    switch (e.target.name) {
      case "title":
        const t = { ...task };
        t.title = val;
        setTask(t);
        break;
      case "note":
        const m = { ...message };
        m.content = val;
        setMessage(m);
        break;
    }
  }

  const handleContentPicked = (contentType: string, contentId: string, label: string) => {
    const t = { ...task };
    switch (modalField) {
      case "associatedWith":
        t.associatedWithType = contentType;
        t.associatedWithId = contentId;
        t.associatedWithLabel = label;
        break;
      case "assignedTo":
        t.assignedToType = contentType;
        t.assignedToId = contentId;
        t.assignedToLabel = label;
        break;
    }

    setTask(t);
    setModalField("")
  }

  const handleModalClose = () => { setModalField(""); }

  return (
    <InputBox headerIcon="list_alt" headerText={t("tasks.newTask.taskNew")} saveFunction={handleSave} cancelFunction={props.onCancel}>
      <ErrorMessages errors={errors} />
      <Grid container spacing={3}>
        <Grid item xs={6} md={(props.compact) ? 6 : 3}>
          <TextField fullWidth label={t("tasks.newTask.associateW")} value={task.associatedWithLabel} InputProps={{ endAdornment: <Icon>search</Icon> }} onFocus={(e) => { e.target.blur(); setModalField("associatedWith") }} />
        </Grid>
        <Grid item xs={6} md={(props.compact) ? 6 : 3}>
          <TextField fullWidth label={t("tasks.newTask.assignTo")} value={task.assignedToLabel || ""} InputProps={{ endAdornment: <Icon>search</Icon> }} onFocus={(e) => { e.target.blur(); setModalField("assignedTo") }} />
        </Grid>
        <Grid item xs={12} md={(props.compact) ? 12 : 6}>
          <TextField fullWidth label={t("common.title")} value={task.title || ""} name="title" onChange={handleChange} />
        </Grid>
      </Grid>

      <TextField fullWidth label={t("common.notes")} value={message.content} name="note" onChange={handleChange} multiline />
      {(modalField !== "") && <ContentPicker onClose={handleModalClose} onSelect={handleContentPicked} />}
    </InputBox>
  );
}
