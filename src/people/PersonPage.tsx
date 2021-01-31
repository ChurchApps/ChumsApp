import React from "react";
import { Person, Groups, Tabs, Household, ImageEditor, PersonHelper, UserHelper, ApiHelper, PersonInterface, Merge, Permissions } from "./components"
import { Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const PersonPage = ({ match }: RouteComponentProps<TParams>) => {

    const [person, setPerson] = React.useState<PersonInterface>(null);
    const [photoUrl, setPhotoUrl] = React.useState<string>(null);
    const [editPhotoUrl, setEditPhotoUrl] = React.useState<string>(null);
    const [showMergeSearch, setShowMergeSearch] = React.useState<boolean>(false)

    const loadData = () => { ApiHelper.get("/people/" + match.params.id, "MembershipApi").then(data => setPerson(data)); }
    const handlePhotoUpdated = (dataUrl: string) => setPhotoUrl(dataUrl);
    const handlePhotoDone = () => setEditPhotoUrl(null);
    const getImageEditor = () => { return (editPhotoUrl === null) ? null : <ImageEditor updatedFunction={handlePhotoUpdated} doneFunction={handlePhotoDone} person={person} /> }
    const togglePhotoEditor = (show: boolean) => { setEditPhotoUrl((show) ? PersonHelper.getPhotoUrl(person) : null); }
    const getGroups = () => { return (UserHelper.checkAccess(Permissions.membershipApi.groupMembers.view)) ? <Groups personId={person?.id} /> : null }
    const handleUpdated = (p: PersonInterface) => { setPerson(p); loadData(); }
    const handleShowSearch = () => {
        setShowMergeSearch(true)
    }

    const hideMergeBox = () => {
        setShowMergeSearch(false)
    }

    const addMergeSearch = (showMergeSearch) ? <Merge hideMergeBox={hideMergeBox} person={person} /> : <></>;
    React.useEffect(loadData, [match.params.id]);

    return (
        <Row>
            <Col lg={8}>
                <Person id="personDetailsBox" person={person} photoUrl={photoUrl} togglePhotoEditor={togglePhotoEditor} updatedFunction={handleUpdated} showMergeSearch={handleShowSearch} />
                <Tabs personId={person?.id} />
            </Col>
            <Col lg={4}>
                {addMergeSearch}
                {getImageEditor()}
                <Household person={person} reload={person?.photoUpdated} />
                {getGroups()}
            </Col>
        </Row >
    )

}
