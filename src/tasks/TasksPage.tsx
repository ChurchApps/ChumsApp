import React from "react";
import { Locale, SmallButton } from "@churchapps/apphelper";
import { TaskList } from "./components/TaskList";
import { Banner } from "@churchapps/apphelper";

export const TasksPage = () => {
  const [status, setStatus] = React.useState("Open");

  //
  return (<>
    <Banner><h1>{Locale.label("tasks.tasksPage.tasks")}</h1></Banner>
    <div id="mainContent">
      <span style={{ float: "right", paddingTop: 15, paddingRight:10 }}>
        <SmallButton icon="settings_suggest" text={Locale.label("tasks.tasksPage.auto")} href="/tasks/automations" /> &nbsp;
        {(status === "Open") && <SmallButton icon="list_alt" text={Locale.label("tasks.tasksPage.showClosed")} onClick={() => { setStatus("Closed") }} />}
        {(status === "Closed") && <SmallButton icon="list_alt" text={Locale.label("tasks.tasksPage.showOpen")} onClick={() => { setStatus("Open") }} />}
      </span>

      <TaskList status={status} />
    </div>
  </>)
};
