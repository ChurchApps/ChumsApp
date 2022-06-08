import React from "react";
import { ApiHelper, FundInterface, FundEdit, DisplayBox, UserHelper, Permissions, Loading } from ".";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Icon } from "@mui/material";

export const Funds: React.FC = () => {
  const [funds, setFunds] = React.useState<FundInterface[]>(null);
  const [editFund, setEditFund] = React.useState<FundInterface>(null);

  const loadData = () => {
    ApiHelper.get("/funds", "GivingApi").then(data => { setFunds(data) });
  }
  const handleFundUpdated = () => { loadData(); setEditFund(null); }
  const getEditSection = () => {
    if (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) return (<a href="about:blank" data-cy="add-fund" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditFund({ id: "", name: "" }) }}><Icon>add</Icon></a>);
    else return null;
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let idx = parseInt(anchor.getAttribute("data-index"));
    setEditFund(funds[idx]);
  }

  const getRows = () => {
    const result: JSX.Element[] = [];

    if (funds.length === 0) {
      result.push(<tr key="0">No funds found.</tr>);
      return result;
    }

    let canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
    let canViewIndividual = UserHelper.checkAccess(Permissions.givingApi.donations.view);
    for (let i = 0; i < funds.length; i++) {
      let f = funds[i];
      const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-${i}`} onClick={handleEdit} data-index={i}><Icon>edit</Icon></a>) : null;
      const viewLink = (canViewIndividual) ? (<Link to={"/donations/funds/" + f.id}>{f.name}</Link>) : (<>{f.name}</>);
      result.push(<tbody key={result.length - 1}>
        <tr>
          <td> {viewLink}</td>
          <td className="text-right"> {editLink}</td>
        </tr>
      </tbody>)
    }
    return result;
  }

  React.useEffect(loadData, []);

  if (editFund === null) {
    let contents = <Loading />
    if (funds) contents = <Table size="sm">{getRows()}</Table>
    return (
      <DisplayBox id="fundsBox" headerIcon="fas fa-hand-holding-usd" data-cy="funds-box" headerText="Funds" editContent={getEditSection()}>
        {contents}
      </DisplayBox>
    );
  }
  else return (<FundEdit fund={editFund} updatedFunction={handleFundUpdated} />);

}

