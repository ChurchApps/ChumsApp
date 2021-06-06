import React from "react";
import { PeopleSearchResults, ApiHelper, DisplayBox, ExportLink } from "./components";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";

export const PeoplePage = () => {
  const [searchText, setSearchText] = React.useState("");
  const [searchResults, setSearchResults] = React.useState(null);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = escape(searchText.trim());
    ApiHelper.get("/people/search?term=" + term, "MembershipApi").then(data => setSearchResults(data));
  }

  const loadData = () => {
    ApiHelper.get("/people/recent", "MembershipApi").then(data => { setSearchResults(data) });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const getEditContent = () => {
    if (searchResults == null) return <></>;
    else return (<ExportLink data={searchResults} filename="people.csv" />);
  }

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(null); } }

  React.useEffect(loadData, []);

  return (
    <>
      <h1><i className="fas fa-user"></i> People</h1>
      <Row>
        <Col lg={8}>
          <DisplayBox id="peopleBox" headerIcon="fas fa-user" headerText="Search" editContent={getEditContent()}>
            <InputGroup>
              <FormControl id="searchText" data-cy="search-input" name="searchText" type="text" placeholder="Name" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} />
              <InputGroup.Append><Button id="searchButton" data-cy="search-button" variant="primary" onClick={handleSubmit}>Search</Button></InputGroup.Append>
            </InputGroup>
            <br />
            <PeopleSearchResults people={searchResults} />
          </DisplayBox>
        </Col>
      </Row>
    </>
  );
}
