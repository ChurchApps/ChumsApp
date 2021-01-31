import React from "react";
import { DisplayBox, ApiHelper, Helper, DonationInterface } from ".";
import { Link } from "react-router-dom"
import { Table } from "react-bootstrap";

interface Props { personId: number }

export const PersonDonations: React.FC<Props> = (props) => {
    const [donations, setDonations] = React.useState<DonationInterface[]>([]);

    const loadData = () => { if (props.personId > 0) ApiHelper.get("/donations?personId=" + props.personId, "GivingApi").then(data => setDonations(data)); }
    const getRows = () => {
        var rows: JSX.Element[] = [];
        for (let i = 0; i < donations.length; i++) {
            var d = donations[i];
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

    React.useEffect(loadData, [props.personId]);

    return (
        <DisplayBox headerIcon="fas fa-hand-holding-usd" headerText="Donations" >
            <Table>
                <thead><tr><th>Batch</th><th>Date</th><th>Method</th><th>Fund</th><th>Amount</th></tr></thead>
                <tbody>{getRows()}</tbody>
            </Table>
        </DisplayBox>
    );
}

