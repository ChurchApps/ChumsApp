import React from "react";
import { Grid, Icon } from "@mui/material";
import { TaskList } from "../tasks/components/TaskList";
import { PeopleSearch } from "./components";
import { Groups } from "../people/components";
import { UserHelper } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { useAppTranslation } from "../contexts/TranslationContext";

export const DashboardPage = () => {
  const { t } = useAppTranslation();

  return (<>
    <Banner><h1> Chums {t("dashboard.dashboardPage.dash")}</h1></Banner>
    <div id="mainContent">
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <PeopleSearch />
          <Groups personId={UserHelper.person?.id} title={t("dashboard.myGroups")} />
        </Grid>
        <Grid item md={4} xs={12}>
          <TaskList compact={true} status="Open" />
        </Grid>
      </Grid>
    </div>
  </>);
};

