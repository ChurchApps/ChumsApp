import React, { useRef } from "react";
import { ApiHelper, FundInterface, FundEdit, DisplayBox, UserHelper, Permissions } from ".";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

export const Funds: React.FC = () => {
    const [funds, setFunds] = React.useState<FundInterface[]>([]);
    const [editFund, setEditFund] = React.useState<FundInterface>(null);
    const isSubscribed = useRef(true);

    const loadData = () => ApiHelper.get("/funds", "GivingApi").then(data => { if (isSubscribed.current) { setFunds(data) } });
    const handleFundUpdated = () => { loadData(); setEditFund(null); }
    const getEditSection = () => {
        if (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) return (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditFund({ id: 0, name: "" }) }}><i className="fas fa-plus"></i></a>);
        else return null;
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = parseInt(anchor.getAttribute("data-index"));
        setEditFund(funds[idx]);
    }

    const getRows = () => {
        var result = [];
        var canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
        var canViewIndividual = UserHelper.checkAccess(Permissions.givingApi.donations.view);
        for (let i = 0; i < funds.length; i++) {
            var f = funds[i];
            const editLink = (canEdit) ? (<a href="about:blank" onClick={handleEdit} data-index={i}><i className="fas fa-pencil-alt"></i></a>) : null;
            const viewLink = (canViewIndividual) ? (<Link to={"/donations/funds/" + f.id}>{f.name}</Link>) : (<>{f.name}</>);
            result.push(<tbody key={result.length - 1}>
                <tr>
                    <td > {viewLink}</td>
                    <td className="text-right"> {editLink}</td>
                </tr >
            </tbody>)
        }
        return result;
    }

    React.useEffect(() => { loadData(); return () => { isSubscribed.current = false } }, []);

    if (editFund === null) return (
        <DisplayBox id="fundsBox" headerIcon="fas fa-hand-holding-usd" headerText="Funds" editContent={getEditSection()} >
            <Table size="sm">{getRows()}</Table >
        </DisplayBox >
    );
    else return (<FundEdit fund={editFund} updatedFunction={handleFundUpdated} />);

}

