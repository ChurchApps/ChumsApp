import React from "react";
import { ApiHelper, DisplayBox, GroupInterface, GroupAdd, UserHelper, ExportLink, Permissions, Loading } from "./components";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";

export const GroupsPage = () => {
  const [groups, setGroups] = React.useState<GroupInterface[]>(null);
  const [showAdd, setShowAdd] = React.useState(false);

  const getEditContent = () => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) return null;
    else
      return (
        <>
          <ExportLink data={groups} spaceAfter={true} filename="groups.csv" />{" "}
          <a href="about:blank" data-cy="add-button" onClick={(e: React.MouseEvent) => { e.preventDefault(); setShowAdd(true); }}>
            <i className="fas fa-plus"></i>
          </a>
        </>
      );
  };

  const handleAddUpdated = () => {
    setShowAdd(false);
    loadData();
  };

  const loadData = () => {
    ApiHelper.get("/groups", "MembershipApi").then((data) => {
      setGroups(data);
    });
  };

  React.useEffect(loadData, []);

  const getRows = () => {
    let rows: JSX.Element[] = [];

    if (groups.length === 0) {
      rows.push(<tr key="0">No groups found. Please create a group.</tr>);
      return rows;
    }

    let lastCat = "";
    for (let i = 0; i < groups.length; i++) {
      let g = groups[i];
      let cat = g.categoryName !== lastCat
        ? (<><i className="far fa-folder"></i> {g.categoryName}</>)
        : (<></>);
      let memberCount = g.memberCount === 1 ? "1 person" : g.memberCount.toString() + " people";
      rows.push(
        <tr key={g.id}>
          <td>{cat}</td>
          <td>
            <i className="fas fa-list"></i>{" "}
            <Link to={"/groups/" + g.id.toString()}>{g.name}</Link>
          </td>
          <td>{memberCount}</td>
        </tr>,
      );
      lastCat = g.categoryName;
    }
    return rows;
  };

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (groups.length === 0) {
      return rows;
    }

    rows.push(<tr key="header"><th>Category</th><th>Name</th><th>People</th></tr>);
    return rows;
  }

  let addBox = showAdd ? (<GroupAdd updatedFunction={handleAddUpdated} />) : (<></>);

  const getTable = () => {
    if (!groups) return <Loading />
    else return (<Table>
      <thead>{getTableHeader()}</thead>
      <tbody>{getRows()}</tbody>
    </Table>);
  }

  return (
    <>
      <h1><i className="fas fa-list"></i> Groups</h1>
      <Row>
        <Col lg={8}>
          <DisplayBox id="groupsBox" headerIcon="fas fa-list" headerText="Groups" editContent={getEditContent()}>
            {getTable()}
          </DisplayBox>
        </Col>
        <Col lg={4}>{addBox}</Col>
      </Row>
    </>
  );

};
