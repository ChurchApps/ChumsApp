import React from "react";
import { Badge, Table, TableBody, TableCell, TableHead, TableRow, Avatar } from "@mui/material";
import {
  type AssignmentInterface,
  type PersonInterface,
  type PositionInterface,
} from "@churchapps/helpers";
import {
  ArrayHelper,
  Locale,
  PersonHelper,
  UserHelper,
  Permissions,
} from "@churchapps/apphelper";

interface Props {
  positions: PositionInterface[];
  assignments: AssignmentInterface[];
  people: PersonInterface[];
  onSelect?: (position: PositionInterface) => void;
  onAssignmentSelect?: (position: PositionInterface, assignment: AssignmentInterface) => void;
}

export const PositionList = (props: Props) => {
  const canEdit = UserHelper.checkAccess(Permissions.membershipApi.plans.edit);
  const colorList = [
    "#FFF8E7", "#E7F2FA", "#E7F4E7", "#F7E7F4", "#F7F4E7", "#E7F7F4", "#F4E7F7", "#F4F7E7", "#E7F7F7", "#F7E7F7", "#F7F7E7", "#E7E7F7", "#F4F4F7", "#F7F4F4", "#F4F7F4", "#F4F4F4"
  ];

  const getPersonLink = (assignment: AssignmentInterface, position: PositionInterface) => {
    const person = ArrayHelper.getOne(props.people, "id", assignment.personId);
    if (person) {
      const image = (
        <span>
          <Avatar src={PersonHelper.getPhotoUrl(person)} sx={{ width: 32, height: 32 }} />
        </span>
      );
      let wrappedImage = image;
      if (assignment.status === "Accepted") {
        wrappedImage = (
          <Badge color="success" variant="dot">
            {image}
          </Badge>
        );
      } else if (assignment.status === "Declined") {
        wrappedImage = (
          <Badge color="error" variant="dot">
            {image}
          </Badge>
        );
      }
      if (canEdit) {
        return (
          <a
            href="about:blank"
            onClick={(e) => {
              e.preventDefault();
              props.onAssignmentSelect(position, assignment || { positionId: position.id });
            }}>
            {wrappedImage}
            {person.name.display}
          </a>
        );
      } else {
        return (
          <span>
            {wrappedImage}
            {person.name.display}
          </span>
        );
      }
    } else return Locale.label("plans.positionList.load");
  };

  const getPeopleLinks = (position: PositionInterface) => {
    const assignments = ArrayHelper.getAll(props.assignments || [], "positionId", position.id);
    const result: JSX.Element[] = [];
    assignments.forEach((assignment) => result.push(<div key={assignment.id}>{getPersonLink(assignment, position)}</div>));
    const remaining = position.count - assignments.length;
    if (remaining > 0 && canEdit) {
      const label = remaining === 1 ? Locale.label("plans.positionList.persNeed") : remaining.toString() + Locale.label("plans.positionList.pplNeed");
      result.push(
        <a
          href="about:blank"
          onClick={(e) => {
            e.preventDefault();
            props.onAssignmentSelect(position, { positionId: position.id });
          }}>
          {label}
        </a>
      );
    }
    return result;
  };

  const getPositionRow = (position: PositionInterface, color: string, first: boolean) => (
    <TableRow style={{ backgroundColor: color }}>
      <TableCell style={{ paddingLeft: 10, fontWeight: "bold" }}>{first ? position.categoryName : ""}</TableCell>
      <TableCell>
        {canEdit ? (
          <a
            href="about:blank"
            onClick={(e) => {
              e.preventDefault();
              props.onSelect(position);
            }}>
            {position.name}
          </a>
        ) : (
          <span>{position.name}</span>
        )}
      </TableCell>
      <TableCell>{getPeopleLinks(position)}</TableCell>
    </TableRow>
  );

  const getPositions = () => {
    let colorIndex = -1;
    const result: JSX.Element[] = [];
    let lastCategory = "";
    for (let i = 0; i < props.positions.length; i++) {
      const position = props.positions[i];
      if (position.categoryName !== lastCategory) {
        colorIndex++;
        lastCategory = position.categoryName;
        result.push(getPositionRow(position, colorList[colorIndex], true));
      } else result.push(getPositionRow(position, colorList[colorIndex], false));
    }
    return result;
  };

  return (
    <>
      <Table size="small" className="positionsTable">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>{Locale.label("plans.positionList.team")}</b>
            </TableCell>
            <TableCell>
              <b>{Locale.label("plans.positionList.pos")}</b>
            </TableCell>
            <TableCell>
              <b>{Locale.label("plans.positionList.ppl")}</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{getPositions()}</TableBody>
      </Table>
    </>
  );
};
