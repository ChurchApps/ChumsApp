import { Icon } from "@mui/material";
import React from "react";
import { SmallButton } from "../../appBase/components";
import useMountedState from "../../appBase/hooks/useMountedState";
import { ApiHelper, AutomationInterface, DisplayBox } from "../components";

export const AutomationsPage = () => {
  const isMounted = useMountedState();
  const [automations, setAutomations] = React.useState<AutomationInterface[]>([])

  const loadData = () => {
    if (isMounted()) {
      ApiHelper.get("/automations", "DoingApi").then(data => {
        if (isMounted()) setAutomations(data);
      });
    }
  }

  const getRows = () => {
    if (automations.length > 0) {
      return <></>
    }
  }

  React.useEffect(loadData, [isMounted]);

  const editContent = <SmallButton icon="add" onClick={() => { }} />

  return (<>
    <h1><Icon>settings_suggest</Icon> Managed Automated Tasks</h1>
    <DisplayBox headerIcon="settings_suggest" headerText="Automated Tasks" editContent={editContent}>
      {getRows()}

    </DisplayBox>
  </>);

};
