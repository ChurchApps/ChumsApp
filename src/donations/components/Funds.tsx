import React, { memo, useCallback, useMemo } from "react";
import { ApiHelper, DisplayBox, UserHelper, Loading, useMountedState, type FundInterface, Permissions, SmallButton, Locale } from "@churchapps/apphelper";
import { FundEdit } from ".";
import { Link } from "react-router-dom";
import { Icon, Table, TableBody, TableCell, TableRow } from "@mui/material";

export const Funds: React.FC = memo(() => {
  const [funds, setFunds] = React.useState<FundInterface[]>(null);
  const [editFund, setEditFund] = React.useState<FundInterface>(null);
  const isMounted = useMountedState();

  const loadData = useCallback(() => {
    ApiHelper.get("/funds", "GivingApi").then(data => {
      if(isMounted()) {
        setFunds(data);
      }});
  }, [isMounted]);
  
  const handleFundUpdated = useCallback(() => { loadData(); setEditFund(null); }, [loadData]);
  const editSection = useMemo(() => {
    if (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) return (<SmallButton onClick={() => { setEditFund({ id: "", name: "", taxDeductible: true }) }} icon="add" data-testid="add-fund-button" ariaLabel="Add fund" />);
    else return null;
  }, []);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const anchor = e.currentTarget as HTMLAnchorElement;
    const idx = parseInt(anchor.getAttribute("data-index"));
    setEditFund(funds[idx]);
  }, [funds]);

  const canEdit = useMemo(() => UserHelper.checkAccess(Permissions.givingApi.donations.edit), []);
  const canViewIndividual = useMemo(() => UserHelper.checkAccess(Permissions.givingApi.donations.view), []);

  const tableRows = useMemo(() => {
    if (!funds) return [];
    
    const result: JSX.Element[] = [];

    if (funds.length === 0) {
      result.push(<TableRow key="0">{Locale.label("donations.funds.noFund")}</TableRow>);
      return result;
    }

    for (let i = 0; i < funds.length; i++) {
      const f = funds[i];
      const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-${i}`} onClick={handleEdit} data-index={i}><Icon>edit</Icon></a>) : null;
      const viewLink = (canViewIndividual) ? (<Link to={"/donations/funds/" + f.id}>{f.name}</Link>) : (<>{f.name}</>);
      result.push(<TableBody key={result.length - 1}>
        <TableRow>
          <TableCell> {viewLink}</TableCell>
          <TableCell align="right"> {editLink}</TableCell>
        </TableRow>
      </TableBody>)
    }
    return result;
  }, [funds, canEdit, canViewIndividual, handleEdit]);

  React.useEffect(loadData, [isMounted]);

  const tableContent = useMemo(() => {
    if (!funds) return <Loading />;
    return <Table size="small">{tableRows}</Table>;
  }, [funds, tableRows]);

  if (editFund === null) {
    return (
      <DisplayBox id="fundsBox" headerIcon="volunteer_activism" data-cy="funds-box" headerText={Locale.label("donations.funds.fund")} editContent={editSection} help="chums/giving">
        {tableContent}
      </DisplayBox>
    );
  }
  else return (<FundEdit fund={editFund} updatedFunction={handleFundUpdated} />);

});

