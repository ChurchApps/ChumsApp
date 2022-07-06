import { Icon } from "@mui/material";
import React from "react";
import { TaskList } from "./components/TaskList";

export const TasksPage = () => (<>
  <h1><Icon>list_alt</Icon> Tasks</h1>
  <TaskList />
</>);
