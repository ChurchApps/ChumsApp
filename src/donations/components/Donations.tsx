import React from "react";
import { SmallButton, ArrayHelper, ApiHelper, UserHelper, DonationInterface, DateHelper, CurrencyHelper, DisplayBox, DonationBatchInterface, ExportLink, Permissions, UniqueIdHelper, FundInterface, Loading, Locale } from "@churchapps/apphelper";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

interface Props { batch: DonationBatchInterface, funds: FundInterface[], addFunction: () => void, editFunction: (id: string) => void }

export const Donations: React.FC<Props> = (props) => {
  const [donations, setDonations] = React.useState<DonationInterface[]>(null);

  const loadData = React.useCallback(() => { ApiHelper.get("/donations?batchId=" + props.batch?.id, "GivingApi").then(data => populatePeople(data)); }, [props.batch]);
  const getEditContent = () => {
    if (props.funds.length === 0) return null;
    return (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) ? (<><ExportLink data={donations} spaceAfter={true} filename="donations.csv" /><SmallButton onClick={() => { props.addFunction() }} icon="add" /></>) : null;
  }

  const populatePeople = async (data: DonationInterface[]) => {
    const peopleIds = ArrayHelper.getIds(data, "personId");
    if (peopleIds.length > 0) {
      const people = await ApiHelper.get("/people/ids?ids=" + escape(peopleIds.join(",")), "MembershipApi");
      data.forEach(d => { if (!UniqueIdHelper.isMissing(d.personId)) d.person = ArrayHelper.getOne(people, "id", d.personId); });
    }
    setDonations(data);
  }

  const showEditDonation = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let id = anchor.getAttribute("data-id");
    props.editFunction(id);
  }

  const getRows = () => {
    let rows: React.ReactNode[] = [];
    let total = 0;
    if (props.funds.length === 0) {
      rows.push(<TableRow key="0" data-cy="error-message">{Locale.label("donations.donations.errMsg")}</TableRow>)
      return rows;
    }
    if (donations.length === 0) {
      rows.push(<TableRow key="0">{Locale.label("donations.donations.noDonMsg")}</TableRow>)
      return rows;
    }
    rows.push(<TableRow key="header" sx={{textAlign: "left"}}><th>{Locale.label("donations.donations.tableIdent")}</th><th>{Locale.label("common.name")}</th><th>{Locale.label("donations.donations.date")}</th><th>{Locale.label("donations.donations.amt")}</th></TableRow>);
    let canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
    for (let i = 0; i < donations.length; i++) {
      let d = donations[i];
      total = total + d.amount;
      const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-link-${i}`} onClick={showEditDonation} data-id={d.id}>{d.id}</a>) : (<>{d.id}</>);
      rows.push(<TableRow key={i}>
        <TableCell>{editLink}</TableCell>
        <TableCell>{d.person?.name.display || Locale.label("donations.donations.anon")}</TableCell>
        <TableCell>{DateHelper.formatHtml5Date(d.donationDate)}</TableCell>
        <TableCell>{CurrencyHelper.formatCurrency(d.amount)}</TableCell>
      </TableRow>);
    }
    rows.push(<TableRow sx={{ borderTop: 2 }}>
      <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>{Locale.label("donations.donations.total")}</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>{CurrencyHelper.formatCurrency(total)}</TableCell>
    </TableRow>);
    return rows;
  }

  React.useEffect(() => { if (!UniqueIdHelper.isMissing(props.batch?.id)) loadData() }, [props.batch, loadData]);

  let content = <Loading />
  if (donations) {
    content = (<Table>
      <TableBody>
        {getRows()}
      </TableBody>
    </Table>);
  }

  return (
    <DisplayBox id="donationsBox" headerIcon="volunteer_activism" headerText={Locale.label("donations.donations.don")} editContent={getEditContent()} help="chums/manual-input">
      {content}
    </DisplayBox>
  );
}

