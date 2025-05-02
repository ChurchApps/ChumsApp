import { ReportWithFilter, DisplayBox } from "@churchapps/apphelper";
import { Grid } from "@mui/material";
import React from "react";
import { useAppTranslation } from "../../contexts/TranslationContext";

export const UsageTrendsTab = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <ReportWithFilter keyName="usageTrends" autoRun={true} />
      <DisplayBox headerIcon="summarize" headerText={t("serverAdmin.adminPage.valueNotes")}>
        <div>
          <h4>{t("serverAdmin.adminPage.notes")}</h4>
          <ul>
            <li key="chums"><b>Chums</b> - {t("serverAdmin.adminPage.noteOne")}</li>
            <li key="b1"><b>B1</b> - {t("serverAdmin.adminPage.noteTwo")}</li>
            <li key="lessons"><b>Lessons</b> - {t("serverAdmin.adminPage.noteThree")}</li>
            <li key="freeshow"><b>FreeShow</b> - {t("serverAdmin.adminPage.noteFour")}</li>
          </ul>
        </div>
      </DisplayBox>
    </>
  );
}

