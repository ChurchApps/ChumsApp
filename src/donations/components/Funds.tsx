import React, { memo, useCallback, useMemo } from "react";
import { DisplayBox, UserHelper, Loading, type FundInterface, Permissions, SmallButton, Locale } from "@churchapps/apphelper";
import { FundEdit } from ".";
import { Link } from "react-router-dom";
import { Icon, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export const Funds: React.FC = memo(() => {
  const [editFund, setEditFund] = React.useState<FundInterface>(null);

  const funds = useQuery<FundInterface[]>({
    queryKey: ["/funds", "GivingApi"],
    placeholderData: [],
  });

  const handleFundUpdated = useCallback(() => {
    funds.refetch();
    setEditFund(null);
  }, [funds]);
  const editSection = useMemo(() => {
    if (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) {
      return (
        <SmallButton
          onClick={() => {
            setEditFund({ id: "", name: "", taxDeductible: true });
          }}
          icon="add"
          data-testid="add-fund-button"
          ariaLabel="Add fund"
        />
      );
    } else return null;
  }, []);

  const handleEdit = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      const anchor = e.currentTarget as HTMLAnchorElement;
      const idx = parseInt(anchor.getAttribute("data-index"));
      setEditFund(funds.data[idx]);
    }, [funds.data]);

  const canEdit = useMemo(() => UserHelper.checkAccess(Permissions.givingApi.donations.edit), []);
  const canViewIndividual = useMemo(() => UserHelper.checkAccess(Permissions.givingApi.donations.view), []);

  const tableRows = useMemo(() => {
    if (!funds.data) return [];

    const result: JSX.Element[] = [];

    if (funds.data.length === 0) {
      result.push(<TableRow key="0">{Locale.label("donations.funds.noFund")}</TableRow>);
      return result;
    }

    for (let i = 0; i < funds.data.length; i++) {
      const f = funds.data[i];
      const editLink = canEdit ? (
        <a href="about:blank" data-cy={`edit-${i}`} onClick={handleEdit} data-index={i}>
          <Icon>edit</Icon>
        </a>
      ) : null;
      const viewLink = canViewIndividual ? <Link to={"/donations/funds/" + f.id}>{f.name}</Link> : <>{f.name}</>;
      result.push(<TableBody key={result.length - 1}>
          <TableRow>
            <TableCell> {viewLink}</TableCell>
            <TableCell align="right"> {editLink}</TableCell>
          </TableRow>
        </TableBody>);
    }
    return result;
  }, [funds.data, canEdit, canViewIndividual, handleEdit]);

  const tableContent = useMemo(() => {
    if (funds.isLoading) return <Loading />;
    return <Table size="small">{tableRows}</Table>;
  }, [funds.isLoading, tableRows]);

  if (editFund === null) {
    return (
      <DisplayBox id="fundsBox" headerIcon="volunteer_activism" data-cy="funds-box" headerText={Locale.label("donations.funds.fund")} editContent={editSection} help="chums/giving">
        {tableContent}
      </DisplayBox>
    );
  } else return <FundEdit fund={editFund} updatedFunction={handleFundUpdated} />;
});
