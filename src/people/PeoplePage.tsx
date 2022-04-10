import React, {useState, useEffect} from "react";
import { PersonInterface } from "../appBase/interfaces";
import { PeopleSearchResults, ApiHelper, DisplayBox, ExportLink, PeopleColumns, FilterBox } from "./components";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import { PersonHelper } from "../helpers";

export const PeoplePage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["photo", "displayName"]);

  const columns = [
    { key: "photo", label: "Photo", shortName: "", type: "binary" },
    { key: "displayName", label: "Display Name", shortName: "Name", type: "string" },
    { key: "lastName", label: "Last Name", shortName: "Last", type: "string" },
    { key: "firstName", label: "First Name", shortName: "First", type: "string" },
    { key: "middleName", label: "Middle Name", shortName: "Middle", type: "string" },
    { key: "address", label: "Address", shortName: "Address", type: "string" },
    { key: "city", label: "City", shortName: "City", type: "string" },
    { key: "state", label: "State", shortName: "State", type: "string" },
    { key: "zip", label: "Zip", shortName: "Zip", type: "number" },
    { key: "email", label: "Primary Email", shortName: "Email", type: "string" },
    { key: "phone", label: "Primary Phone", shortName: "Phone", type: "string" },
    { key: "birthDate", label: "Birthdate", shortName: "Birthdate", type: "date" },
    { key: "birthDay", label: "Birthday (No Year)", shortName: "Birthday", type: "date" },
    { key: "age", label: "Age", shortName: "Age", type: "number" },
    { key: "gender", label: "Gender", shortName: "Gender", type: "string" },
    { key: "membershipStatus", label: "Membership Status", shortName: "Membership", type: "string" },
    { key: "maritalStatus", label: "Marital Status", shortName: "Married", type: "string" },
    { key: "anniversary", label: "Anniversary", shortName: "Anniversary", type: "date" }
  ]

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(null); } }

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = escape(searchText.trim());
    ApiHelper.get("/people/search?term=" + term, "MembershipApi").then(data => {
      setSearchResults(data.map((d: PersonInterface) => PersonHelper.getExpandedPersonObject(d)))
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleToggleColumn = (key: string) => {
    let sc = [...selectedColumns];
    const index = sc.indexOf(key);
    if (index === -1) sc.push(key);
    else sc.splice(index, 1);
    setSelectedColumns(sc);
  }

  const loadData = () => {
    ApiHelper.get("/people/recent", "MembershipApi").then(data => {
      setSearchResults(data.map((d: PersonInterface) => PersonHelper.getExpandedPersonObject(d)))
    });
  }

  const getEditContent = () => {
    if (searchResults == null) return <></>;
    else return (<>
      <PeopleColumns selectedColumns={selectedColumns} toggleColumn={handleToggleColumn} columns={columns} />
      <ExportLink data={searchResults} filename="people.csv" /> &nbsp;
    </>);
  }

  useEffect(loadData, []);

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
          <FilterBox columns={columns} handleResetButton={loadData} updatePeople={setSearchResults} />
        </Col>
      </Row>
    </>
  );
}
