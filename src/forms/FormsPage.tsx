import React, { useRef } from "react";
import { ApiHelper, DisplayBox, FormInterface, FormEdit, UserHelper, Permissions } from "./components"
import { Link } from "react-router-dom"
import { Row, Col, Table } from "react-bootstrap";

export const FormsPage = () => {
    const [forms, setForms] = React.useState<FormInterface[]>([]);
    const [selectedFormId, setSelectedFormId] = React.useState(-1);
    const isSubscribed = useRef(true)

    const loadData = () => { ApiHelper.get("/forms", "MembershipApi").then(data => { if (isSubscribed.current) { setForms(data) } }); }

    const getRows = () => {
        var result = [];
        const canEdit = UserHelper.checkAccess(Permissions.membershipApi.forms.edit)
        for (let i = 0; i < forms.length; i++) {
            const editLink = (canEdit) ? (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedFormId(forms[i].id); }}><i className="fas fa-pencil-alt"></i></a>) : null;
            result.push(<tr key={i}>
                <td><i className="fas fa-align-left" /> <Link to={"/forms/" + forms[i].id}>{forms[i].name}</Link></td>
                <td>{editLink}</td>
            </tr>);
        }
        return result;
    }

    const handleUpdate = () => { loadData(); setSelectedFormId(-1); }

    const getSidebar = () => {
        if (selectedFormId === -1) return <></>
        else return (<FormEdit formId={selectedFormId} updatedFunction={handleUpdate} ></FormEdit>)
    }

    const getEditContent = () => {
        if (!UserHelper.checkAccess(Permissions.membershipApi.forms.edit)) return null;
        else return (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedFormId(0); }} ><i className="fas fa-plus"></i></a>);
    }

    React.useEffect(() => { loadData(); return () => { isSubscribed.current = false } }, []);

    if (!UserHelper.checkAccess(Permissions.membershipApi.forms.view)) return (<></>);
    else return (
        <>
            <h1><i className="fas fa-align-left"></i> Forms</h1>
            <Row>
                <Col lg={8}>
                    <DisplayBox id="formsBox" headerText="Forms" headerIcon="fas fa-align-left" editContent={getEditContent()} >
                        <Table>
                            <thead><tr><th colSpan={2}>Name</th></tr></thead>
                            <tbody>{getRows()}</tbody>
                        </Table>
                    </DisplayBox>
                </Col>
                <Col lg={4}>{getSidebar()}</Col>
            </Row>
        </>
    );
}

