import React from "react";
import { DisplayBox, ApiHelper, Helper, DonationInterface, UniqueIdHelper, Loading } from ".";
import { Link } from "react-router-dom"
import { Table } from "react-bootstrap";
import { PersonPaymentMethods } from "./PersonPaymentMethods";

interface Props { personId: string }

export const PersonDonations: React.FC<Props> = (props) => {
  const [donations, setDonations] = React.useState<DonationInterface[]>(null);

  const loadData = () => {
    if (!UniqueIdHelper.isMissing(props.personId)) ApiHelper.get("/donations?personId=" + props.personId, "GivingApi").then(data => setDonations(data));
  }

  const getRows = () => {
    let rows: JSX.Element[] = [];

    if (donations.length === 0) {
      rows.push(<tr key="0"><td>Donations will appear once a donation has been entered.</td></tr>);
      return rows;
    }

    for (let i = 0; i < donations.length; i++) {
      let d = donations[i];
      rows.push(
        <tr>
          <td><Link to={"/donations/" + d.batchId}>{d.batchId}</Link></td>
          <td>{Helper.formatHtml5Date(d.donationDate)}</td>
          <td>{d.method}</td>
          <td>{d.fund.name}</td>
          <td>{Helper.formatCurrency(d.amount)}</td>
        </tr>
      );
    }
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = []

    if (donations.length > 0) {
      rows.push(<tr key="header"><th>Batch</th><th>Date</th><th>Method</th><th>Fund</th><th>Amount</th></tr>);
    }

    return rows;
  }

  React.useEffect(loadData, [props.personId]);

  const getTable = () => {
    if (!donations) return <Loading />;
    else return (<Table>
      <thead>{getTableHeader()}</thead>
      <tbody>{getRows()}</tbody>
    </Table>);
  }

  return (
    <>
      <PersonPaymentMethods personId={props.personId} />
      <DisplayBox headerIcon="fas fa-hand-holding-usd" headerText="Donations">
        {getTable()}
      </DisplayBox>
    </>
  );
}
