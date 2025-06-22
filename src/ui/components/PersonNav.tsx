import { Icon } from "@mui/material";
import React from "react";

export const PersonNav: React.FC = () => {

  return (<div className="sideNav" style={{ height: "100vh", borderRight: "1px solid #CCC" }}>
    <ul>
      <li key="details" className="active"><a href="about:blank"><Icon>person</Icon> Details</a></li>
      <li key="notes"><a href="about:blank"><Icon>sticky_note_2</Icon> Notes</a></li>
      <li key="attendance"><a href="about:blank"><Icon>calendar_month</Icon> Attendance</a></li>
      <li key="giving"><a href="about:blank"><Icon>volunteer_activism</Icon> Giving</a></li>
      <li key="groups"><a href="about:blank"><Icon>people</Icon> Groups</a></li>
    </ul>

    <div className="subhead">Custom Forms</div>
    <ul>
      <li key="discipleship"><a href="about:blank">Discipleship</a></li>
    </ul>



  </div>);
}
