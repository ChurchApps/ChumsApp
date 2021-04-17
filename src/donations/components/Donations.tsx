import React from "react";
import { ApiHelper, UserHelper, DonationInterface, Helper, DisplayBox, DonationBatchInterface, ExportLink, Permissions, UniqueIdHelper, FundInterface } from ".";
import { Table } from "react-bootstrap";
import { ArrayHelper } from "../../helpers";

interface Props { batch: DonationBatchInterface, funds: FundInterface[], addFunction: () => void, editFunction: (id: string) => void }

export const Donations: React.FC<Props> = (props) => {
    const [donations, setDonations] = React.useState<DonationInterface[]>([]);

    const loadData = React.useCallback(() => { ApiHelper.get("/donations?batchId=" + props.batch?.id, "GivingApi").then(data => populatePeople(data)); }, [props.batch]);
    const showAddDonation = (e: React.MouseEvent) => { e.preventDefault(); props.addFunction() }
    const getEditContent = () => {
        if (props.funds.length === 0) return null;
        return (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) ? (<><ExportLink data={donations} spaceAfter={true} filename="donations.csv" /><a href="about:blank" data-cy="make-donation" onClick={showAddDonation} ><i className="fas fa-plus"></i></a></>) : null;
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
        var anchor = e.currentTarget as HTMLAnchorElement;
        var id = anchor.getAttribute("data-id");
        props.editFunction(id);
    }

    const getRows = () => {
        var rows: React.ReactNode[] = [];
        if (props.funds.length === 0) {
            rows.push(<tr key="0" data-cy="error-message">No fund found. Please create a fund before making a donation</tr>)
            return rows;
        }
        if (donations.length === 0) {
            rows.push(<tr key="0">No donations made! Start donating and they will show up here.</tr>)
            return rows;
        }
        rows.push(<tr><th>Id</th><th>Name</th><th>Date</th><th>Amount</th></tr>);
        var canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
        for (let i = 0; i < donations.length; i++) {
            var d = donations[i];
            const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-link-${i}`} onClick={showEditDonation} data-id={d.id}>{d.id}</a>) : (<>{d.id}</>);
            rows.push(<tr key={i}>
                <td>{editLink}</td>
                <td>{d.person?.name.display || "Anonymous"}</td>
                <td>{Helper.formatHtml5Date(d.donationDate)}</td>
                <td>{Helper.formatCurrency(d.amount)}</td>
            </tr>);
        }
        return rows;
    }

    React.useEffect(() => { if (!UniqueIdHelper.isMissing(props.batch?.id)) loadData() }, [props.batch, loadData]);
    //React.useEffect(populatePeople, [donations]);

    return (
        <DisplayBox id="donationsBox" headerIcon="fas fa-hand-holding-usd" headerText="Donations" editContent={getEditContent()} >
            <Table>
                <tbody>                            
                    {getRows()}
                </tbody>
            </Table>
        </DisplayBox >
    );
}

