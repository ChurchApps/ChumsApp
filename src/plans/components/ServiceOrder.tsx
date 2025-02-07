import React from "react";
import { Grid, Icon, IconButton, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { ApiHelper, ArrayHelper, AssignmentInterface, BlockoutDateInterface, DisplayBox, InputBox, Locale, Notes, PersonInterface, PlanInterface, PositionInterface, TimeInterface } from "@churchapps/apphelper";
import { PositionEdit } from "./PositionEdit";
import { PositionList } from "./PositionList";
import { AssignmentEdit } from "./AssignmentEdit";
import { TimeList } from "./TimeList";
import { PlanValidation } from "./PlanValidation";
import { Banner } from "@churchapps/apphelper";

interface Props {
  plan: PlanInterface
}

export const ServiceOrder = (props: Props) => {
  const [plan, setPlan] = React.useState<PlanInterface>(null);

  const loadData = async () => {
    setPlan(props.plan);
  }

  React.useEffect(() => { loadData(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (<>

    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Order of Service" headerIcon="album">
          Content
        </DisplayBox>

      </Grid>
      <Grid item md={4} xs={12}>
        Sidebar
      </Grid>
    </Grid>

  </>)
};

