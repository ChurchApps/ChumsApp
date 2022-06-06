import React from "react";
import { PersonInterface } from "../appBase/interfaces";
import { PeopleSearchResults, ApiHelper, DisplayBox, ExportLink, PeopleColumns } from "./components";
import { Row, Col } from "react-bootstrap";
import { PersonHelper } from "../helpers";
import { PeopleSearch } from "./components/PeopleSearch";
import { Wrapper } from "../components/Wrapper";

export const PeoplePage = () => {

  const [searchResults, setSearchResults] = React.useState(null);
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(["photo", "displayName"]);

  const columns = [
    { key: "photo", label: "Photo", shortName: "" },
    { key: "displayName", label: "Display Name", shortName: "Name" },
    { key: "lastName", label: "Last Name", shortName: "Last" },
    { key: "firstName", label: "First Name", shortName: "First" },
    { key: "middleName", label: "Middle Name", shortName: "Middle" },
    { key: "address", label: "Address", shortName: "Address" },
    { key: "city", label: "City", shortName: "City" },
    { key: "state", label: "State", shortName: "State" },
    { key: "zip", label: "Zip", shortName: "Zip" },
    { key: "email", label: "Primary Email", shortName: "Email" },
    { key: "phone", label: "Primary Phone", shortName: "Phone" },
    { key: "birthDate", label: "Birthdate", shortName: "Birthdate" },
    { key: "birthDay", label: "Birthday (No Year)", shortName: "Birthday" },
    { key: "age", label: "Age", shortName: "Age" },
    { key: "gender", label: "Gender", shortName: "Gender" },
    { key: "membershipStatus", label: "Membership Status", shortName: "Membership" },
    { key: "maritalStatus", label: "Marital Status", shortName: "Married" },
    { key: "anniversary", label: "Anniversary", shortName: "Anniversary" }
  ];

  const loadData = () => {
    ApiHelper.get("/people/recent", "MembershipApi").then(data => {
      setSearchResults(data.map((d: PersonInterface) => PersonHelper.getExpandedPersonObject(d)))
    });
  }

  const handleToggleColumn = (key: string) => {
    let sc = [...selectedColumns];
    const index = sc.indexOf(key);
    if (index === -1) sc.push(key);
    else sc.splice(index, 1);
    setSelectedColumns(sc);
  }

  const getEditContent = () => {
    if (searchResults == null) return <></>;
    else return (<>
      <PeopleColumns selectedColumns={selectedColumns} toggleColumn={handleToggleColumn} columns={columns} />

      <ExportLink data={searchResults} filename="people.csv" /> &nbsp;
    </>);
  }

  React.useEffect(loadData, []);

  return (
    <Wrapper pageTitle="Search People">
      <Row>
        <Col lg={8}>
          <DisplayBox id="peopleBox" headerIcon="fas fa-user" headerText="People" editContent={getEditContent()}>
            <PeopleSearchResults people={searchResults} columns={columns} selectedColumns={selectedColumns} />
          </DisplayBox>
        </Col>
        <Col lg={4}>
          <PeopleSearch updateSearchResults={(people) => setSearchResults(people)} />
        </Col>
      </Row>
    </Wrapper>
  );
}
