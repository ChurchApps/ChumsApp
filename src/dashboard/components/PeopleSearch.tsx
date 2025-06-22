import React from "react";
import {
 Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import {
 ChumsPersonHelper } from "../components";
import {
 ApiHelper, DisplayBox, Locale, type PersonInterface, SearchCondition 
} from "@churchapps/apphelper";
import {
 PeopleSearchResults } from "../../people/components";

export const PeopleSearch = () => {
  const [searchResults, setSearchResults] = React.useState(null);
  const [searchText, setSearchText] = React.useState("");
  const selectedColumns = ["photo", "displayName"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    const term = searchText.trim();
    const condition: SearchCondition = { field: "displayName", operator: "contains", value: term }
    ApiHelper.post("/people/advancedSearch", [condition], "MembershipApi").then((data: PersonInterface[]) => {
      setSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)))
    });
  }

  const columns = [
    { key: "photo", label: Locale.label("dashboard.peopleSearch.photo"), shortName: "" },
    { key: "displayName", label: Locale.label("dashboard.peopleSearch.display"), shortName: Locale.label("common.name") }
  ];

  return (<>
    <DisplayBox id="peopleBox" headerIcon="person" headerText={Locale.label("dashboard.peopleSearch.ppl")}>
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="searchText">{Locale.label("common.name")}</InputLabel>
        <OutlinedInput id="searchText" aria-label="searchBox" name="searchText" type="text" label={Locale.label("common.name")} value={searchText} onChange={handleChange} data-testid="dashboard-people-search-input"
          endAdornment={<Button variant="contained" onClick={handleSubmit} data-testid="dashboard-search-button" aria-label="Search people">{Locale.label("common.search")}</Button>}
        />
      </FormControl>
      {searchResults && <PeopleSearchResults people={searchResults} columns={columns} selectedColumns={selectedColumns} />}
    </DisplayBox>
  </>);
}
