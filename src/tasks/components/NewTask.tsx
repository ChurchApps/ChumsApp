import {
 Grid, TextField, Card, CardContent, Typography, Stack, Box, Button, InputAdornment 
} from "@mui/material";
import React from "react";
import {
 ApiHelper, ArrayHelper, type ConversationInterface, ErrorMessages, Locale, type MessageInterface, type TaskInterface, UserHelper 
} from "@churchapps/apphelper";
import { ContentPicker } from "./ContentPicker";
import { Assignment as TaskIcon, Search as SearchIcon, Cancel as CancelIcon, Save as SaveIcon } from "@mui/icons-material";

interface Props {
  onCancel: () => void;
  onSave: () => void;
  compact?: boolean;
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
    associatedWithLabel: UserHelper.person?.name?.display,
  };
  const [task, setTask] = React.useState<TaskInterface>(initialData);
  const [message, setMessage] = React.useState<MessageInterface>({});
  const [modalField, setModalField] = React.useState("");
  const [errors, setErrors] = React.useState([]);

  const validate = () => {
    const result = [];
    if (!task.associatedWithId) result.push(Locale.label("tasks.newTask.associatePers"));
    if (!task.assignedToId) result.push(Locale.label("tasks.newTask.assignPers"));
    if (!task.title?.trim()) result.push(Locale.label("tasks.newTask.titleTask"));
    setErrors(result);
    return result.length === 0;
  };

  const sendNotification = async (task: TaskInterface) => {
    const type = task.assignedToType;
    const id = task.assignedToId;
    const data: any = {
      peopleIds: [id],
      contentType: "task",
      contentId: task.id,
      message: `New Task Assignment: ${task.title}`,
    };

    if (type === "group") {
      const groupMembers = await ApiHelper.get("/groupmembers?groupId=" + task.assignedToId.toString(), "MembershipApi");
      const ids = ArrayHelper.getIds(groupMembers, "personId");
      data.peopleIds = ids;
    }

    await ApiHelper.post("/notifications/create", data, "MessagingApi");
  };

  const handleSave = async () => {
    if (validate()) {
      const tasks = await ApiHelper.post("/tasks", [task], "DoingApi");
      if (message.content && (message.content?.trim() !== undefined || message.content?.trim() !== "")) {
        const conv: ConversationInterface = {
          allowAnonymousPosts: false,
          contentType: "task",
          contentId: task.id,
          title: "Task #" + tasks[0].id + " Notes",
          visibility: "hidden",
        };
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
  };

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
  };

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
    setModalField("");
  };

  const handleModalClose = () => {
    setModalField("");
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
        transition: "all 0.2s ease-in-out",
        "&:hover": { boxShadow: 2 },
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TaskIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                {Locale.label("tasks.newTask.taskNew")}
              </Typography>
            </Stack>
          </Box>

          {/* Error Messages */}
          {errors.length > 0 && <ErrorMessages errors={errors} />}

          {/* Form Fields */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: props.compact ? 6 : 4 }}>
              <TextField
                fullWidth
                label={Locale.label("tasks.newTask.associateW")}
                value={task.associatedWithLabel}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                  sx: { "& .MuiInputBase-input": { cursor: "pointer" } },
                }}
                onFocus={(e) => {
                  e.target.blur();
                  setModalField("associatedWith");
                }}
                data-testid="associate-with-input"
                aria-label="Associate with"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "primary.main" } } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: props.compact ? 6 : 4 }}>
              <TextField
                fullWidth
                label={Locale.label("tasks.newTask.assignTo")}
                value={task.assignedToLabel || ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                  sx: { "& .MuiInputBase-input": { cursor: "pointer" } },
                }}
                onFocus={(e) => {
                  e.target.blur();
                  setModalField("assignedTo");
                }}
                data-testid="assign-to-input"
                aria-label="Assign to"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "primary.main" } } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: props.compact ? 12 : 4 }}>
              <TextField
                fullWidth
                label={Locale.label("common.title")}
                value={task.title || ""}
                name="title"
                onChange={handleChange}
                data-testid="task-title-input"
                aria-label="Task title"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "primary.main" } } }}
              />
            </Grid>
          </Grid>

          {/* Notes Field */}
          <TextField
            fullWidth
            label={Locale.label("common.notes")}
            value={message.content}
            name="note"
            onChange={handleChange}
            multiline
            rows={4}
            data-testid="task-notes-input"
            aria-label="Task notes"
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "primary.main" } } }}
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={props.onCancel}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {Locale.label("common.cancel")}
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {Locale.label("common.save")}
            </Button>
          </Stack>
        </Stack>
      </CardContent>

      {/* Modal */}
      {modalField !== "" && <ContentPicker onClose={handleModalClose} onSelect={handleContentPicked} />}
    </Card>
  );
};
