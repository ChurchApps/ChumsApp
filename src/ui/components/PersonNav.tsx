import { Button, Grid, Icon } from "@mui/material";
import React from "react";

export const PersonNav: React.FC = () => {
  const a="";

  return (<div className="sideNav" style={{height:"100vh", borderRight:"1px solid #CCC" }}>
    <ul>
      <li className="active"><a href="about:blank"><Icon>person</Icon> Details</a></li>
      <li><a href="about:blank"><Icon>sticky_note_2</Icon> Notes</a></li>
      <li><a href="about:blank"><Icon>calendar_month</Icon> Attendance</a></li>
      <li><a href="about:blank"><Icon>volunteer_activism</Icon> Giving</a></li>
      <li><a href="about:blank"><Icon>people</Icon> Groups</a></li>
    </ul>

    <div className="subhead">Custom Forms</div>
    <ul>
      <li><a href="about:blank">Discipleship</a></li>
    </ul>



  </div>);
}
