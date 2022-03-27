import React, {useState, useEffect} from "react";
import { PersonInterface } from "../appBase/interfaces";
import { PeopleSearchResults, ApiHelper, DisplayBox, ExportLink, PeopleColumns, FilterDropDown, PeopleColumnsDropDown } from "./components";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import { PersonHelper } from "../helpers";

type FilterCriteria = {
  field: string;
  operator: string;
  criteria: string;
}

const emptyFilter = {
  field: "",
  operator: "",
  criteria: ""
}
export const PeoplePage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["photo", "displayName"]);
  const [filterArray, setFilterArray] = useState<FilterCriteria[]>([emptyFilter]);
  console.log(filterArray)

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

  const updateFilterArrayField = (field: string) => {
    let filterToUpdate = {...filterArray[filterArray.length - 1]};
    filterToUpdate.field = field;
    setFilterArray([...filterArray, filterToUpdate])
  }
  const updateFilterArrayOperator = (operator: string) => {
    let filterToUpdate = {...filterArray[filterArray.length - 1]};
    filterToUpdate.operator = operator;
    setFilterArray([...filterArray, filterToUpdate])
  }
  const updateFilterArrayCriteria = (e: React.ChangeEvent<HTMLInputElement>) => {
    let filterToUpdate = {...filterArray[filterArray.length - 1]};
    filterToUpdate.criteria = e.currentTarget.value;
    setFilterArray([...filterArray, filterToUpdate])
  }

  const filter: JSX.Element = <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
    <PeopleColumnsDropDown selectedColumns={selectedColumns} toggleColumn={updateFilterArrayField} columns={columns} />
    <FilterDropDown toggleColumn={updateFilterArrayOperator} filterParam={"hi"} />
    <FormControl id="searchText" aria-label="searchBox" name="searchText" type="text" placeholder="Filter criteria" value={searchText} onChange={updateFilterArrayCriteria} onKeyDown={handleKeyDown} style={{maxWidth: 100}} />
  </div>

  const [filterElementArray, setFilterElementArray] = useState<JSX.Element[]>([filter]);

  const handleAddFilter = () => {
    const newFilterArray: JSX.Element[] = [...filterElementArray];
    newFilterArray.push(<p>AND</p>)
    newFilterArray.push(filter)
    setFilterElementArray(newFilterArray);
    setFilterArray([...filterArray, emptyFilter])
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
          <DisplayBox headerIcon="fas fa-filter" headerText="Filter">
            {filterElementArray}
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 50}}>
              <Button id="searchButton" variant="primary" onClick={handleAddFilter}>Add Filter</Button>
              <Button id="searchButton" variant="primary" onClick={handleAddFilter}>Clear All</Button>
              <Button id="applyButton" variant="primary" onClick={handleSubmit}>Apply</Button>
            </div>
          </DisplayBox>
        </Col>
      </Row>
    </>
  );
}
