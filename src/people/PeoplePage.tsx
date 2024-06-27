import React from "react";
import { Locale, PersonInterface } from "@churchapps/apphelper";
import { PeopleSearchResults, PeopleColumns } from "./components";
import { ApiHelper, DisplayBox, ExportLink } from "@churchapps/apphelper";
import { Grid, Icon } from "@mui/material"
import { ChumsPersonHelper } from "../helpers";
import { PeopleSearch } from "./components/PeopleSearch";
import { useMountedState } from "@churchapps/apphelper";

export const PeoplePage = () => {

  const [searchResults, setSearchResults] = React.useState(null);
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(["photo", "displayName"]);
  const isMounted = useMountedState();

  const columns = [
    { key: "photo", label: Locale.label("people.peoplePage.photo"), shortName: "" },
    { key: "displayName", label: Locale.label("person.displayName"), shortName: Locale.label("common.name") },
    { key: "lastName", label: Locale.label("person.lastName"), shortName: Locale.label("people.peoplePage.last") },
    { key: "firstName", label: Locale.label("person.firstName"), shortName: Locale.label("people.peoplePage.first") },
    { key: "middleName", label: Locale.label("person.middleName"), shortName: Locale.label("people.peoplePage.middle") },
    { key: "address", label: Locale.label("person.address"), shortName: Locale.label("person.address") },
    { key: "city", label: Locale.label("person.city"), shortName: Locale.label("person.city") },
    { key: "state", label: Locale.label("person.state"), shortName: Locale.label("person.state") },
    { key: "zip", label: Locale.label("person.zip"), shortName: Locale.label("person.zip") },
    { key: "email", label: Locale.label("people.peoplePage.primEmail"), shortName: Locale.label("person.email") },
    { key: "phone", label: Locale.label("people.peoplePage.primPhone"), shortName: Locale.label("person.phone") },
    { key: "birthDate", label: Locale.label("people.peoplePage.bDate"), shortName: Locale.label("people.peoplePage.bDate") },
    { key: "birthDay", label: Locale.label("people.peoplePage.bDayNo"), shortName: Locale.label("people.peoplePage.bDay") },
    { key: "age", label: Locale.label("people.peoplePage.age"), shortName: Locale.label("people.peoplePage.age") },
    { key: "gender", label: Locale.label("people.peoplePage.gender"), shortName: Locale.label("people.peoplePage.gender") },
    { key: "membershipStatus", label: Locale.label("people.peoplePage.memShipStat"), shortName: Locale.label("people.peoplePage.memShip") },
    { key: "maritalStatus", label: Locale.label("people.peoplePage.marStat"), shortName: Locale.label("people.peoplePage.married") },
    { key: "anniversary", label: Locale.label("people.peoplePage.anni"), shortName: Locale.label("people.peoplePage.anni") },
    { key: "nametagNotes", label: Locale.label("people.peoplePage.nameNote"), shortName: Locale.label("people.peoplePage.notes") },
    { key: "deleteOption", label: Locale.label("people.peoplePage.deleteOp"), shortName: Locale.label("people.peoplePage.delete") }
  ];

  const loadData = () => {
    ApiHelper.get("/people/recent", "MembershipApi").then(data => {
      if(!isMounted()) {
        return;
      }
      setSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)))
    });
  }

  const handleToggleColumn = (key: string) => {
    let sc = [...selectedColumns];
    const index = sc.indexOf(key);
    if (index === -1) sc.push(key);
    else sc.splice(index, 1);
    sessionStorage.setItem("selectedColumns", JSON.stringify(sc));
    setSelectedColumns(sc);
  }

  const getEditContent = () => {
    if (searchResults == null) return <></>;
    else return (<>
      <ExportLink data={searchResults} filename="people.csv" /> &nbsp;
      <PeopleColumns selectedColumns={selectedColumns} toggleColumn={handleToggleColumn} columns={columns} />
    </>);
  }

  React.useEffect(() => {
    if (sessionStorage.getItem("selectedColumns")) {
      setSelectedColumns(JSON.parse(sessionStorage.getItem("selectedColumns")));
    } else {
      sessionStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(loadData, [isMounted]);

  return (
    <>
      <h1><Icon>person</Icon> {Locale.label("people.peoplePage.searchPpl")}</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox id="peopleBox" headerIcon="person" headerText={Locale.label("people.peoplePage.ppl")} editContent={getEditContent()} help="chums/adding-people">
            <PeopleSearchResults people={searchResults} columns={columns} selectedColumns={selectedColumns} updateSearchResults={(people) => setSearchResults(people)} />
          </DisplayBox>
        </Grid>
        <Grid item md={4} xs={12}>
          <PeopleSearch updateSearchResults={(people) => setSearchResults(people)} />
        </Grid>
      </Grid>
    </>
  );
}
