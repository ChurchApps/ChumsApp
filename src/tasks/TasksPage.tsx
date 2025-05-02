import React, { useState } from "react";
import { Banner } from "@churchapps/apphelper";
import { TaskList } from "./components/TaskList";
import { SmallButton } from "@churchapps/apphelper";
import { useAppTranslation } from "../contexts/TranslationContext";

export const TasksPage = () => {
  const [status, setStatus] = useState("Open");
  const { t } = useAppTranslation();

  return (<>
    <Banner><h1>{t("tasks.tasksPage.tasks")}</h1></Banner>
    <div id="mainContent">
      <SmallButton icon="settings_suggest" text={t("tasks.tasksPage.auto")} href="/tasks/automations" /> &nbsp;
      {(status === "Open") && <SmallButton icon="list_alt" text={t("tasks.tasksPage.showClosed")} onClick={() => { setStatus("Closed") }} />}
      {(status === "Closed") && <SmallButton icon="list_alt" text={t("tasks.tasksPage.showOpen")} onClick={() => { setStatus("Open") }} />}
      <TaskList status={status} />
    </div>
  </>);
};
