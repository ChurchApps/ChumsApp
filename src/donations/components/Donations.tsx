import React from "react";
import { SmallButton, ArrayHelper, ApiHelper, UserHelper, DonationInterface, DateHelper, CurrencyHelper, DisplayBox, DonationBatchInterface, ExportLink, Permissions, UniqueIdHelper, FundInterface, Loading, Locale } from "@churchapps/apphelper";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

interface Props { batch: DonationBatchInterface, funds: FundInterface[], addFunction: () => void, editFunction: (id: string) => void }

export const Donations: React.FC<Props> = (props) => {
  const { batch, funds, addFunction, editFunction } = props;
  const [donations, setDonations] = React.useState<DonationInterface[]>(null);

  // Memoize permission check to avoid repeated calls
  const canEdit = React.useMemo(() => UserHelper.checkAccess(Permissions.givingApi.donations.edit), []);

  const populatePeople = React.useCallback(async (data: DonationInterface[]) => {
    const peopleIds = ArrayHelper.getIds(data, "personId");
    if (peopleIds.length > 0) {
      const people = await ApiHelper.get("/people/ids?ids=" + escape(peopleIds.join(",")), "MembershipApi");
      data.forEach(d => { if (!UniqueIdHelper.isMissing(d.personId)) d.person = ArrayHelper.getOne(people, "id", d.personId); });
    }
    setDonations(data);
  }, []);
  
  const loadData = React.useCallback(() => { ApiHelper.get("/donations?batchId=" + batch?.id, "GivingApi").then(data => populatePeople(data)); }, [batch, populatePeople]);
  
  const getEditContent = React.useCallback(() => {
    if (funds.length === 0) return null;
    return canEdit ? (<><ExportLink data={donations} spaceAfter={true} filename="donations.csv" /><SmallButton onClick={addFunction} icon="add" data-testid="add-donation-button" ariaLabel="Add donation" /></>) : null;
  }, [funds.length, canEdit, donations, addFunction]);

  const showEditDonation = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const anchor = e.currentTarget as HTMLAnchorElement;
    const id = anchor.getAttribute("data-id");
    editFunction(id);
  }, [editFunction]);

  // Memoize the total calculation to avoid recalculating on every render
  const donationsTotal = React.useMemo(() => {
    if (!donations || donations.length === 0) return 0;
    return donations.reduce((sum, donation) => sum + donation.amount, 0);
  }, [donations]);

  const getRows = React.useCallback(() => {
    const rows: React.ReactNode[] = [];
    
    if (props.funds.length === 0) {
      rows.push(<TableRow key="0" data-cy="error-message">{Locale.label("donations.donations.errMsg")}</TableRow>)
      return rows;
    }
    if (!donations || donations.length === 0) {
      rows.push(<TableRow key="0">{Locale.label("donations.donations.noDonMsg")}</TableRow>)
      return rows;
    }
    
    // Add header row
    rows.push(<TableRow key="header" sx={{textAlign: "left"}}><th>{Locale.label("donations.donations.tableIdent")}</th><th>{Locale.label("common.name")}</th><th>{Locale.label("donations.donations.date")}</th><th>{Locale.label("donations.donations.amt")}</th></TableRow>);
    
    // Add donation rows
    for (let i = 0; i < donations.length; i++) {
      const d = donations[i];
      const editLink = canEdit ? (<a href="about:blank" data-cy={`edit-link-${i}`} onClick={showEditDonation} data-id={d.id}>{d.id}</a>) : (<>{d.id}</>);
      rows.push(<TableRow key={i}>
        <TableCell>{editLink}</TableCell>
        <TableCell>{d.person?.name.display || Locale.label("donations.donations.anon")}</TableCell>
        <TableCell>{DateHelper.formatHtml5Date(d.donationDate)}</TableCell>
        <TableCell>{CurrencyHelper.formatCurrency(d.amount)}</TableCell>
      </TableRow>);
    }
    
    // Add total row
    rows.push(<TableRow key="total" sx={{ borderTop: 2 }}>
      <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>{Locale.label("donations.donations.total")}</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>{CurrencyHelper.formatCurrency(donationsTotal)}</TableCell>
    </TableRow>);
    
    return rows;
  }, [donations, props.funds.length, canEdit, showEditDonation, donationsTotal]);

  React.useEffect(() => { if (!UniqueIdHelper.isMissing(props.batch?.id)) loadData() }, [props.batch, loadData]);

  // Memoize the table content to avoid recreating when dependencies haven't changed
  const tableContent = React.useMemo(() => {
    if (!donations) return <Loading />;
    
    return (
      <Table>
        <TableBody>
          {getRows()}
        </TableBody>
      </Table>
    );
  }, [donations, getRows]);

  return (
    <DisplayBox id="donationsBox" headerIcon="volunteer_activism" headerText={Locale.label("donations.donations.don")} editContent={getEditContent()} help="chums/manual-input">
      {tableContent}
    </DisplayBox>
  );
}

