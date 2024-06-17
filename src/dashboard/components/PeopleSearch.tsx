import React from "react";
import { Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ChumsPersonHelper } from "../components";
import { ApiHelper, DisplayBox, Locale, PersonInterface, SearchCondition } from "@churchapps/apphelper";
import { PeopleSearchResults } from "../../people/components";

export const PeopleSearch = () => {
  const [searchResults, setSearchResults] = React.useState(null);
  const [searchText, setSearchText] = React.useState("");
  const selectedColumns = ["photo", "displayName"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = searchText.trim();
    const condition: SearchCondition = { field: "displayName", operator: "contains", value: term }
    ApiHelper.post("/people/advancedSearch", [condition], "MembershipApi").then(data => {
      setSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)))
    });
  }

  const columns = [
    { key: "photo", label: Locale.label("attendance.peopleSearch.photo"), shortName: "" },
    { key: "displayName", label: Locale.label("attendance.peopleSearch.display"), shortName: Locale.label("attendance.peopleSearch.name") }
  ];

  return (<>
    <DisplayBox id="peopleBox" headerIcon="person" headerText={Locale.label("attendance.peopleSearch.ppl")}>
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="searchText">{Locale.label("attendance.peopleSearch.name")}</InputLabel>
        <OutlinedInput id="searchText" aria-label="searchBox" name="searchText" type="text" label={Locale.label("attendance.peopleSearch.name")} value={searchText} onChange={handleChange}
          endAdornment={<Button variant="contained" onClick={handleSubmit}>{Locale.label("attendance.peopleSearch.search")}</Button>}
        />
      </FormControl>
      {searchResults && <PeopleSearchResults people={searchResults} columns={columns} selectedColumns={selectedColumns} />}
    </DisplayBox>
  </>);
}
