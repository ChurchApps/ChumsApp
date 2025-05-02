import React from "react";
import { MinistryList } from "./components/MinistryList";
import { DisplayBox } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { useAppTranslation } from "../contexts/TranslationContext";

export const PlansPage = () => {
  const { t } = useAppTranslation();

  const a = true;

  return (<>
    <Banner><h1>{t("plans.plansPage.selMin")}</h1></Banner>
    <div id="mainContent">
      <MinistryList />
    </div>
  </>);
}

