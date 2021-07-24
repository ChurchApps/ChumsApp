import React from "react";
import { Link, useHistory } from "react-router-dom";
import { PersonHelper, ErrorMessages, ApiHelper, PersonInterface, HouseholdInterface, UserHelper, Permissions, Loading } from ".";
import { Row, Col, FormControl, Button, Table } from "react-bootstrap";

interface Props {
  people: PersonInterface[]
}

export const PeopleSearchResults: React.FC<Props> = (props) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [errors, setErrors] = React.useState<string[]>([]);

  const history = useHistory()

  const handleAdd = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    if (validate()) {
      let person = { name: { first: firstName, last: lastName } } as PersonInterface;
      let household = { name: lastName } as HouseholdInterface;
      ApiHelper.post("/households", [household], "MembershipApi").then(data => {
        household.id = data[0].id;
        person.householdId = household.id;
        ApiHelper.post("/people", [person], "MembershipApi").then(data => {
          person.id = data[0].id
          history.push("/people/" + person.id);
        });
      });
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(null); } }

  const validate = () => {
    let errors = []
    if (firstName.trim() === "") errors.push("First name cannot be blank.");
    if (lastName.trim() === "") errors.push("Last name cannot be blank.");
    setErrors(errors);
    return errors.length === 0;
  }

  const getRows = () => {
    let result = [];
    for (let i = 0; i < props.people.length; i++) {
      let p = props.people[i];
      result.push(<tr key={p.id}>
        <td><img src={PersonHelper.getPhotoUrl(p)} alt="avatar" /></td>
        <td><Link to={"/people/" + p.id.toString()}>{p.name.display}</Link></td>
      </tr>);
    }
    return result;
  }
  const getAddPerson = () => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.people.edit)) return (<></>);
    else return (
      <>
        <hr />
        <ErrorMessages errors={errors} />
        <b>Add a New Person</b>
        <Row>
          <Col><FormControl id="firstName" aria-label="firstName" placeholder="First Name" name="firstName" value={firstName} onChange={e => setFirstName(e.currentTarget.value)} onKeyDown={handleKeyDown} /></Col>
          <Col><FormControl id="lastName" aria-label="lastName" placeholder="Last Name" name="lastName" value={lastName} onChange={e => setLastName(e.currentTarget.value)} onKeyDown={handleKeyDown} /></Col>
          <Col><Button id="addPersonBtn" variant="primary" onClick={handleAdd}>Add</Button></Col>
        </Row>
      </>);
  }
  // todo - please change how error is shown and test according to that way. also update errors for sign in and forgot password page
  if (!props.people) return <Loading /> //return (<div className="alert alert-info">Use the search box above to search for a member or add a new one.</div>)
  else if (props.people.length === 0) return (<>
    <p>No results found.  Please search for a different name or add a new person</p>
    {getAddPerson()}
  </>);
  else {
    let result
      = <>
        <Table id="peopleTable">
          <thead><tr><th></th><th>Name</th></tr></thead>
          <tbody>{getRows()}</tbody>
        </Table>
        {getAddPerson()}
      </>;
    return result;
  }
}
