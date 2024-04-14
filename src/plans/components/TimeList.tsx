import React from "react";
import { Icon, IconButton } from "@mui/material";
import { ArrayHelper, DateHelper, DisplayBox, PlanInterface, PositionInterface, TimeInterface } from "@churchapps/apphelper";
import { TimeEdit } from "./TimeEdit";

interface Props {
  times: TimeInterface[],
  plan: PlanInterface,
  positions: PositionInterface[],
  onUpdate: () => void
}

export const TimeList = (props:Props) => {
  const [time, setTime] = React.useState<TimeInterface>(null);

  const handleAdd = () => {
    let startTime = new Date(props.plan.serviceDate);
    startTime.setHours(9);
    startTime.setMinutes(0);
    let endTime = new Date(props.plan.serviceDate);
    endTime.setHours(10);
    endTime.setMinutes(30);

    setTime({planId:props.plan.id, displayName: "Sunday Service", startTime, endTime });
  }

  const handleSelect = (t:TimeInterface) => {
    t.startTime = new Date(t.startTime);
    t.endTime = new Date(t.endTime);
    t.startTime.setMinutes(t.startTime.getMinutes() - t.startTime.getTimezoneOffset());
    t.endTime.setMinutes(t.endTime.getMinutes() - t.endTime.getTimezoneOffset());
    setTime(t);
  }

  const getAddTimeLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button" onClick={handleAdd}>
      <Icon color="primary">add</Icon>
    </IconButton>
  );

  const getRows = () => {
    const result:JSX.Element[] = [];
    props.times.forEach(t => {
      const teamList = t.teams?.split(",") || [];
      const startTime = new Date(t.startTime);
      startTime.setMinutes(startTime.getMinutes() - startTime.getTimezoneOffset());
      const endTime = new Date(t.endTime);
      endTime.setMinutes(endTime.getMinutes() - endTime.getTimezoneOffset());
      result.push(<tr key={t.id}>
        <td style={{verticalAlign:"top"}}><Icon>schedule</Icon></td>
        <td style={{width:"90%"}}>
          <a href="about:blank" onClick={(e) => { e.preventDefault(); handleSelect(t); } }>{t.displayName}</a>
          <div style={{fontSize:12}}>{DateHelper.prettyDateTime(startTime) }
            {t.endTime ? " - " + DateHelper.prettyTime(endTime) : ""}
            <br />
            <i style={{color:"#999"}}>{teamList.join(", ")}</i>
          </div>

        </td>
      </tr>);
    });
    if (props.times.length===0) result.push(<tr><td colSpan={2}>No times have been added yet</td></tr>);
    return result;
  }

  if (time) {
    const categories = ArrayHelper.getUniqueValues(props.positions, "categoryName").sort();
    return <TimeEdit time={time} categories={categories} onUpdate={() => { setTime(null); props.onUpdate(); }} />
  }
  else return (<DisplayBox headerText="Times" headerIcon="schedule" editContent={getAddTimeLink()}>
    <table style={{width:"100%"}}>
      {getRows()}
    </table>
  </DisplayBox>);
}

