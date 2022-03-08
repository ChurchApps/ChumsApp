import React from "react";
import { PeopleSearchResults, ApiHelper, DisplayBox, ExportLink, PeopleColumns } from "./components";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";

export const PeoplePage = () => {
  const [searchText, setSearchText] = React.useState("");
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
  ]

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = escape(searchText.trim());
    ApiHelper.get("/people/search?term=" + term, "MembershipApi").then(data => setSearchResults(data));
  }

  const loadData = () => {
    ApiHelper.get("/people/recent", "MembershipApi").then(data => { setSearchResults(data) });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

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

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(null); } }

  React.useEffect(loadData, []);

  return (
    <>
      <h1><i className="fas fa-user"></i> People</h1>
      <Row>
        <Col lg={8}>
          <DisplayBox id="peopleBox" headerIcon="fas fa-user" headerText="People" editContent={getEditContent()}>
            <PeopleSearchResults people={searchResults} columns={columns} selectedColumns={selectedColumns} />
          </DisplayBox>
        </Col>
        <Col lg={4}>
          <DisplayBox headerIcon="fas fa-user" headerText="Search">
            <InputGroup>
              <FormControl id="searchText" aria-label="searchBox" name="searchText" type="text" placeholder="Name" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} />
              <InputGroup.Append><Button id="searchButton" variant="primary" onClick={handleSubmit}>Search</Button></InputGroup.Append>
            </InputGroup>
          </DisplayBox>
        </Col>
      </Row>
    </>
  );
}
