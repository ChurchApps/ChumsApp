import React from "react";
import {  Table, TableBody, TableCell, TableHead, TableRow,  } from "@mui/material";
import { ArrayHelper, PersonHelper, PersonInterface } from "@churchapps/apphelper";
import { AssignmentInterface, PositionInterface } from "../../helpers";


interface Props {
  positions: PositionInterface[],
  assignments: AssignmentInterface[],
  people: PersonInterface[],
  onSelect?: (position:PositionInterface) => void
  onAssignmentSelect?: (position:PositionInterface, assignment: AssignmentInterface) => void
}


export const PositionList = (props:Props) => {
  const colorList = ["#FFF8E7", "#E7F2FA", "#E7F4E7", "#F7E7F4", "#F7F4E7", "#E7F7F4", "#F4E7F7", "#F4F7E7", "#E7F7F7", "#F7E7F7", "#F7F7E7", "#E7E7F7", "#F4F4F7", "#F7F4F4", "#F4F7F4", "#F4F4F4"];


  const defaultPerson:PersonInterface = {
    id: "bTrK6d0kvF6", photoUpdated: new Date(1649905513000), name: { display: "John Doe" },
    contactInfo: undefined
  };


  const getPersonLink = (assignment: AssignmentInterface, position:PositionInterface) => {
    const person = ArrayHelper.getOne(props.people, "id", assignment.personId) || defaultPerson;
    return (<a href="about:blank" onClick={(e) => {e.preventDefault(); props.onAssignmentSelect(position, assignment || {positionId:position.id} )}}>
      <img src={PersonHelper.getPhotoUrl(person)} alt="avatar" style={{height:25}} />
      {person.name.display}
    </a>);
  }

  const getPeopleLinks = (position:PositionInterface) => {
    const assignments = ArrayHelper.getAll(props.assignments || [], "positionId", position.id);
    console.log("Assignments", assignments, "Position ID", position.id, "All", props.assignments)
    let result:JSX.Element[] = [];
    assignments.forEach(assignment => result.push(<div key={assignment.id}>{getPersonLink(assignment, position)}</div>));
    const remaining = position.count - assignments.length;
    if (remaining > 0)
    {
      const label = (remaining === 1) ? "1 Person Needed" : remaining.toString() + " People Needed";
      result.push (<a href="about:blank" onClick={(e) => {e.preventDefault(); props.onAssignmentSelect(position, {positionId:position.id} )}}>{label}</a>);
    }
    return result;

  }

  const getPositionRow = (position:PositionInterface, color:string, first:boolean) => (
    <TableRow style={{backgroundColor: color}}>
      <TableCell style={{paddingLeft:10, fontWeight:"bold"}}>{(first) ? position.categoryName : ""}</TableCell>
      <TableCell><a href="about:blank" onClick={(e) => { e.preventDefault(); props.onSelect(position); }}>{position.name}</a></TableCell>
      <TableCell>{getPeopleLinks(position)}</TableCell>
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

    <Table size="small" className="positionsTable">
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

