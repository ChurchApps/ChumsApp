import { Icon } from "@mui/material";
import React from "react";
import { SmallButton } from "../appBase/components";
import { TaskList } from "./components/TaskList";

export const TasksPage = () => {
  const [status, setStatus] = React.useState("Open");

  //
  return (<>
    <span style={{ float: "right", paddingTop: 15 }}>
      <SmallButton icon="settings_suggest" text="Automations" href="/tasks/automations" /> &nbsp;
      {(status === "Open") && <SmallButton icon="list_alt" text="Show Closed" onClick={() => { setStatus("Closed") }} />}
      {(status === "Closed") && <SmallButton icon="list_alt" text="Show Open" onClick={() => { setStatus("Open") }} />}
    </span>
    <h1><Icon>list_alt</Icon> Tasks</h1>
    <TaskList status={status} />
  </>)
};
