import React from "react";
import { ApiHelper, UserHelper, DonationInterface, DateHelper, CurrencyHelper, DisplayBox, DonationBatchInterface, ExportLink, Permissions, UniqueIdHelper, FundInterface, Loading } from ".";
import { ArrayHelper } from "../../helpers";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { SmallButton } from "../../appBase/components";

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
    if (props.funds.length === 0) {
      rows.push(<TableRow key="0" data-cy="error-message">No fund found. Please create a fund before making a donation</TableRow>)
      return rows;
    }
    if (donations.length === 0) {
      rows.push(<TableRow key="0">No donations have been tracked. Once donations are entered they will show up here.</TableRow>)
      return rows;
    }
    rows.push(<TableRow sx={{textAlign: "left"}}><th>Id</th><th>Name</th><th>Date</th><th>Amount</th></TableRow>);
    let canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
    for (let i = 0; i < donations.length; i++) {
      let d = donations[i];
      const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-link-${i}`} onClick={showEditDonation} data-id={d.id}>{d.id}</a>) : (<>{d.id}</>);
      rows.push(<TableRow key={i}>
        <TableCell>{editLink}</TableCell>
        <TableCell>{d.person?.name.display || "Anonymous"}</TableCell>
        <TableCell>{DateHelper.formatHtml5Date(d.donationDate)}</TableCell>
        <TableCell>{CurrencyHelper.formatCurrency(d.amount)}</TableCell>
      </TableRow>);
    }
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
    <DisplayBox id="donationsBox" headerIcon="volunteer_activism" headerText="Donations" editContent={getEditContent()}>
      {content}
    </DisplayBox>
  );
}

