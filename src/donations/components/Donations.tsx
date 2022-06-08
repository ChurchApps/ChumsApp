import React from "react";
import { ApiHelper, UserHelper, DonationInterface, DateHelper, CurrencyHelper, DisplayBox, DonationBatchInterface, ExportLink, Permissions, UniqueIdHelper, FundInterface, Loading } from ".";
import { Table } from "react-bootstrap";
import { ArrayHelper } from "../../helpers";
import { Icon } from "@mui/material";

interface Props { batch: DonationBatchInterface, funds: FundInterface[], addFunction: () => void, editFunction: (id: string) => void }

export const Donations: React.FC<Props> = (props) => {
  const [donations, setDonations] = React.useState<DonationInterface[]>(null);

  const loadData = React.useCallback(() => { ApiHelper.get("/donations?batchId=" + props.batch?.id, "GivingApi").then(data => populatePeople(data)); }, [props.batch]);
  const showAddDonation = (e: React.MouseEvent) => { e.preventDefault(); props.addFunction() }
  const getEditContent = () => {
    if (props.funds.length === 0) return null;
    return (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) ? (<><ExportLink data={donations} spaceAfter={true} filename="donations.csv" /><a href="about:blank" data-cy="make-donation" onClick={showAddDonation}><Icon>add</Icon></a></>) : null;
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
      rows.push(<tr key="0" data-cy="error-message">No fund found. Please create a fund before making a donation</tr>)
      return rows;
    }
    if (donations.length === 0) {
      rows.push(<tr key="0">No donations have been tracked. Once donations are entered they will show up here.</tr>)
      return rows;
    }
    rows.push(<tr><th>Id</th><th>Name</th><th>Date</th><th>Amount</th></tr>);
    let canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
    for (let i = 0; i < donations.length; i++) {
      let d = donations[i];
      const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-link-${i}`} onClick={showEditDonation} data-id={d.id}>{d.id}</a>) : (<>{d.id}</>);
      rows.push(<tr key={i}>
        <td>{editLink}</td>
        <td>{d.person?.name.display || "Anonymous"}</td>
        <td>{DateHelper.formatHtml5Date(d.donationDate)}</td>
        <td>{CurrencyHelper.formatCurrency(d.amount)}</td>
      </tr>);
    }
    return rows;
  }

  React.useEffect(() => { if (!UniqueIdHelper.isMissing(props.batch?.id)) loadData() }, [props.batch, loadData]);

  let content = <Loading />
  if (donations) {
    content = (<Table>
      <tbody>
        {getRows()}
      </tbody>
    </Table>);
  }

  return (
    <DisplayBox id="donationsBox" headerIcon="fas fa-hand-holding-usd" headerText="Donations" editContent={getEditContent()}>
      {content}
    </DisplayBox>
  );
}

