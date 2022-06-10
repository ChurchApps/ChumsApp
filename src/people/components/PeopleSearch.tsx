import React from "react";
import { PersonHelper, PersonInterface, DisplayBox, ApiHelper } from ".";
import { ArrayHelper, GroupMemberInterface, InputBox, SearchCondition } from "../../components";
import { EditCondition } from "./EditCondition";
import { Button, Icon, OutlinedInput, FormControl } from "@mui/material";

interface Props {
  updateSearchResults: (people: PersonInterface[]) => void
}

export function PeopleSearch(props: Props) {
  const [searchText, setSearchText] = React.useState("");
  const [advanced, setAdvanced] = React.useState(false);
  const [conditions, setConditions] = React.useState<SearchCondition[]>([])
  const [showAddCondition, setShowAddCondition] = React.useState(true);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(null); } }

  const toggleAdvanced = (e: React.MouseEvent) => { e.preventDefault(); setAdvanced(!advanced); }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = searchText.trim();
    const condition: SearchCondition = { field: "displayName", operator: "contains", value: term }
    ApiHelper.post("/people/advancedSearch", [condition], "MembershipApi").then(data => {
      props.updateSearchResults(data.map((d: PersonInterface) => PersonHelper.getExpandedPersonObject(d)))
    });
  }

  const convertConditions = async () => {
    console.log(conditions)
    const result: SearchCondition[] = [];
    for (const c of conditions) {
      switch (c.field) {
        case "groupMember":
          const val = JSON.parse(c.value);
          const members: GroupMemberInterface[] = await ApiHelper.get("/groupmembers?groupId=" + val.value, "MembershipApi");
          const peopleIds = ArrayHelper.getIds(members, "personId");
          result.push({ field: "id", operator: c.operator, value: peopleIds.join(",") });
          break;
        default:
          result.push(c);
          break;
      }
    }
    return result;
  }

  const handleAdvancedSearch = async () => {
    const postConditions = await convertConditions();
    ApiHelper.post("/people/advancedSearch", postConditions, "MembershipApi").then(data => {
      props.updateSearchResults(data.map((d: PersonInterface) => PersonHelper.getExpandedPersonObject(d)))
    });

  }

  const getSimpleSearch = () => (
    <DisplayBox headerIcon="person" headerText="Simple Search" editContent={<Button onClick={toggleAdvanced} sx={{textTransform: "none"}}>Advanced</Button>}>
      <FormControl fullWidth variant="outlined" onKeyDown={handleKeyDown}>
        <OutlinedInput id="searchText" aria-label="searchBox" name="searchText" type="text" label="Name" value={searchText} onChange={handleChange}
          endAdornment={<Button variant="contained" onClick={handleSubmit}>Search</Button>}
        />
      </FormControl>
    </DisplayBox>
  );

  const getAddCondition = () => {
    if (showAddCondition) return <EditCondition conditionAdded={(condition) => { const c = [...conditions]; c.push(condition); setConditions(c); setShowAddCondition(false) }} />
    else return <a href="about:blank" className="float-right text-success" onClick={(e) => { e.preventDefault(); setShowAddCondition(true); }}><Icon>add</Icon> Add Condition</a>
  }

  const removeCondition = (index: number) => {
    const c = [...conditions];
    c.splice(index, 1);
    setConditions(c);
  }

  const getDisplayConditions = () => {
    const result: JSX.Element[] = [];
    let idx = 0;
    for (let c of conditions) {
      const displayField = c.field.split(/(?=[A-Z])/).map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(" ");
      const displayOperator = c.operator.replace("lessThanEqual", "<=").replace("greaterThan", ">").replace("equals", "=").replace("lessThan", "<").replace("greaterThanEqual", ">=").replace("notIn", "not in");
      const index = idx;
      let displayValue = (c.value.indexOf('"value":') > -1) ? JSON.parse(c.value).text : c.value;
      result.push(<div>
        <a href="about:blank" onClick={(e) => { e.preventDefault(); removeCondition(index) }}><Icon style={{ marginRight: 10 }}>delete</Icon></a>
        <b>{displayField}</b> {displayOperator} <i>{displayValue}</i>
      </div>);
      idx++;
    }
    return result;
  }

  const getAdvancedSearch = () => (<InputBox id="advancedSearch" headerIcon="person" headerText="Advanced Search" headerActionContent={<Button onClick={toggleAdvanced} sx={{textTransform: "none"}}>Simple</Button>} saveFunction={handleAdvancedSearch} saveText="Search">
    <p>All people where:</p>
    {getDisplayConditions()}
    {getAddCondition()}
  </InputBox>)

  if (!advanced) return getSimpleSearch();
  else return getAdvancedSearch();

}
