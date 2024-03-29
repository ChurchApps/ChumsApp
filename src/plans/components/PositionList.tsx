import React from "react";
import {  Table, TableBody, TableCell, TableHead, TableRow,  } from "@mui/material";
import { PersonHelper, PersonInterface } from "@churchapps/apphelper";
import { PositionInterface } from "../../helpers";


interface Props { positions: PositionInterface[], onSelect?: (position:PositionInterface) => void}



export const PositionList = (props:Props) => {
  const temp = false;
  const colorList = ["#FFF8E7", "#E7F2FA", "#E7F4E7", "#F7E7F4", "#F7F4E7", "#E7F7F4", "#F4E7F7", "#F4F7E7", "#E7F7F7", "#F7E7F7", "#F7F7E7", "#E7E7F7", "#F4F4F7", "#F7F4F4", "#F4F7F4", "#F4F4F4"];


  const person:PersonInterface = {
    id: "bTrK6d0kvF6", photoUpdated: new Date(1649905513000), name: { display: "John Doe" },
    contactInfo: undefined
  };

  const getPersonLink = () => (
    <a href="about:blank">
      <img src={PersonHelper.getPhotoUrl(person)} alt="avatar" style={{height:20}} />
      {person.name.display}
    </a>
  )

  const getPositionRow = (position:PositionInterface, color:string, first:boolean) => (
    <TableRow style={{backgroundColor: color}}>
      <TableCell style={{paddingLeft:10, fontWeight:"bold"}}>{(first) ? position.categoryName : ""}</TableCell>
      <TableCell><a href="about:blank" onClick={(e) => { e.preventDefault(); props.onSelect(position); }}>{position.name}</a></TableCell>
      <TableCell>{getPersonLink()}</TableCell>
    </TableRow>
  )

  const getPositions = () => {
    let colorIndex = -1;
    const result:JSX.Element[] = [];
    let lastCategory = "";
    for (let i = 0; i < props.positions.length; i++) {
      const position = props.positions[i];
      if (position.categoryName !== lastCategory) {
        colorIndex++;
        lastCategory = position.categoryName;
        result.push(getPositionRow(position, colorList[colorIndex], true));
      }
      else result.push(getPositionRow(position, colorList[colorIndex], false));
    }
    return result;
  }

  return (<>

    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell><b>Team</b></TableCell>
          <TableCell><b>Position</b></TableCell>
          <TableCell><b>People</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {getPositions()}
      </TableBody>
    </Table>

  </>);
}

