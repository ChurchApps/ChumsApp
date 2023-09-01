import { Grid, Icon, Table, TableCell, TableRow } from "@mui/material";
import React from "react";
import { SmallButton } from "@churchapps/apphelper";
import { useMountedState } from "@churchapps/apphelper";
import { ApiHelper, AutomationInterface, DisplayBox } from "@churchapps/apphelper";
import { AutomationDetails } from "./components/AutomationDetails";
import { AutomationEdit } from "./components/AutomationEdit";

export const AutomationsPage = () => {
  const isMounted = useMountedState();
  const [automations, setAutomations] = React.useState<AutomationInterface[]>([])
  const [showAdd, setShowAdd] = React.useState(false);
  const [editAutomation, setEditAutomation] = React.useState(null);

  const loadData = () => {
    if (isMounted()) {
      ApiHelper.get("/automations", "DoingApi").then(data => {
        if (isMounted()) setAutomations(data);
      });
    }
  }

  const getRows = () => {
    if (automations.length > 0) {
      const result: JSX.Element[] = [];
      automations.forEach(a => {
        const automation = a;
        result.push(<TableRow>
          <TableCell>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditAutomation(automation); }}>{a.title}</a>
          </TableCell>
        </TableRow>)
      })
      return <Table>{result}</Table>
    }
  }

  const handleAdded = (automation: AutomationInterface) => {
    setShowAdd(false);
    setEditAutomation(automation);
    loadData();
  }

  const handleDelete = () => {
    setEditAutomation(null);
    loadData();
  }

  React.useEffect(loadData, [isMounted]);

  const editContent = <SmallButton icon="add" onClick={() => { setShowAdd(true); setEditAutomation(null); }} />

  return (<>
    <h1><Icon>settings_suggest</Icon> Managed Automated Tasks</h1>

    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerIcon="settings_suggest" headerText="Automated Tasks" editContent={editContent}>
          {getRows()}

        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        {showAdd && <AutomationEdit automation={{ title: "", active: true, recurs: "never" }} onCancel={() => { setShowAdd(false); }} onSave={handleAdded} />}
        {editAutomation && <AutomationDetails automation={editAutomation} onChange={loadData} onDelete={handleDelete} />}
      </Grid>
    </Grid>
  </>);
};
