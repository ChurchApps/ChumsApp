import React from "react";
import { PersonHelper, PersonInterface, DisplayBox, ApiHelper } from ".";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { InputBox, SearchCondition } from "../../components";
import { EditCondition } from "./EditCondition";

interface Props {
  updateSearchResults: (people: PersonInterface[]) => void
}

export function PeopleSearch(props: Props) {
  const [searchText, setSearchText] = React.useState("");
  const [advanced, setAdvanced] = React.useState(false);
  const [conditions, setConditions] = React.useState<SearchCondition[]>([])
  const [showAddCondition, setShowAddCondition] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(null); } }

  const toggleAdvanced = (e: React.MouseEvent) => { e.preventDefault(); setAdvanced(!advanced); }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = searchText.trim();
    const condition: SearchCondition = { field: "displayName", operator: "contains", value: term }
    ApiHelper.post("/people/search2", [condition], "MembershipApi").then(data => {
      props.updateSearchResults(data.map((d: PersonInterface) => PersonHelper.getExpandedPersonObject(d)))
    });
  }

  const handleAdvancedSearch = () => {
    ApiHelper.post("/people/search2", conditions, "MembershipApi").then(data => {
      props.updateSearchResults(data.map((d: PersonInterface) => PersonHelper.getExpandedPersonObject(d)))
    });

  }

  const getSimpleSearch = () => (<DisplayBox headerIcon="fas fa-user" headerText="Simple Search" editContent={<a href="about:blank" onClick={toggleAdvanced}>Advanced</a>}>
    <InputGroup>
      <FormControl id="searchText" aria-label="searchBox" name="searchText" type="text" placeholder="Name" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} />
      <InputGroup.Append><Button id="searchButton" variant="primary" onClick={handleSubmit}>Search</Button></InputGroup.Append>
    </InputGroup>
  </DisplayBox>)



  const getAddCondition = () => {
    if (showAddCondition) return <EditCondition conditionAdded={(condition) => { const c = [...conditions]; c.push(condition); setConditions(c); setShowAddCondition(false) }} />
    else return <a href="about:blank" className="float-right text-success" onClick={(e) => { e.preventDefault(); setShowAddCondition(true); }}><i className="fas fa-plus"></i> Add Condition</a>
  }

  const getDisplayConditions = () => {
    const result: JSX.Element[] = [];
    conditions.forEach(c => {
      result.push(<div>
        <b>{c.field}</b> <i>{c.operator}</i> "{c.value}"
      </div>)
    })
    return result;
  }

  const getAdvancedSearch = () => (<InputBox id="advancedSearch" headerIcon="fas fa-user" headerText="Advanced Search" headerActionContent={<a href="about:blank" onClick={toggleAdvanced}>Simple</a>} saveFunction={handleAdvancedSearch} saveText="Search">
    <p>All people where:</p>
    {getDisplayConditions()}
    {getAddCondition()}
  </InputBox>)

  if (!advanced) return getSimpleSearch();
  else return getAdvancedSearch();

}
