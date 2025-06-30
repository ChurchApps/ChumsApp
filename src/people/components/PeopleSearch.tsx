import React from "react";
import { ChumsPersonHelper } from ".";
import { type SearchCondition, type PersonInterface, DisplayBox, ApiHelper, Locale } from "@churchapps/apphelper";
import { Button, OutlinedInput, FormControl, InputLabel } from "@mui/material";
import { AdvancedPeopleSearch } from "./AdvancedPeopleSearch";

interface Props {
  updateSearchResults: (people: PersonInterface[]) => void
}

export function PeopleSearch(props: Props) {
  const [searchText, setSearchText] = React.useState("");
  const [advanced, setAdvanced] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(null); } }

  const toggleAdvanced = () => { setAdvanced(!advanced); }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    const term = searchText.trim();
    const condition: SearchCondition = { field: "displayName", operator: "contains", value: term }
    ApiHelper.post("/people/advancedSearch", [condition], "MembershipApi").then(data => {
      props.updateSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)))
    });
  }

  const getSimpleSearch = () => (
    <DisplayBox headerIcon="person" headerText={Locale.label("people.peopleSearch.simpSearch")} help="chums/advanced-search" editContent={<Button onClick={(e) => {e.preventDefault(); toggleAdvanced() }} sx={{ textTransform: "none" }} data-testid="toggle-advanced-search-button" aria-label="Toggle advanced search">{Locale.label("people.peopleSearch.adv")}</Button>}>
      <FormControl fullWidth variant="outlined" onKeyDown={handleKeyDown}>
        <InputLabel htmlFor="searchText">{Locale.label("common.name")}</InputLabel>
        <OutlinedInput id="searchText" aria-label="searchBox" name="searchText" type="text" label={Locale.label("common.name")} value={searchText} onChange={handleChange} data-testid="people-search-input"
          endAdornment={<Button variant="contained" onClick={handleSubmit} data-testid="people-search-button" aria-label="Search people">{Locale.label("common.search")}</Button>}
        />
      </FormControl>
    </DisplayBox>
  );

  if (!advanced) return getSimpleSearch();
  else return <AdvancedPeopleSearch updateSearchResults={props.updateSearchResults} toggleFunction={toggleAdvanced} />

}
