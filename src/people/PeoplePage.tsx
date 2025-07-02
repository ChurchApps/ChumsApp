import React, { memo } from "react";
import { Locale, type PersonInterface } from "@churchapps/apphelper";
import { PeopleSearchResults, PeopleColumns } from "./components";
import { ApiHelper, ExportLink } from "@churchapps/apphelper";
import { Grid, Box, Typography, Card, Stack, Button } from "@mui/material";
import { ChumsPersonHelper } from "../helpers";
import { PeopleSearch } from "./components/PeopleSearch";
import { useMountedState } from "@churchapps/apphelper";
import { Search as SearchIcon, People as PeopleIcon, PersonAdd as PersonAddIcon, FileDownload as ExportIcon } from "@mui/icons-material";
import { PageHeader } from "../components/ui";

export const PeoplePage = memo(() => {
  const [searchResults, setSearchResults] = React.useState(null);
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(["photo", "displayName"]);
  const [isSearchPerformed, setIsSearchPerformed] = React.useState(false);
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
    { key: "birthDate", label: Locale.label("person.birthDate"), shortName: Locale.label("person.birthDate") },
    { key: "birthDay", label: Locale.label("people.peoplePage.bDayNo"), shortName: Locale.label("people.peoplePage.bDay") },
    { key: "age", label: Locale.label("person.age"), shortName: Locale.label("person.age") },
    { key: "gender", label: Locale.label("person.gender"), shortName: Locale.label("person.gender") },
    { key: "membershipStatus", label: Locale.label("person.membershipStatus"), shortName: Locale.label("person.membershipStatus") },
    { key: "maritalStatus", label: Locale.label("person.maritalStatus"), shortName: Locale.label("person.married") },
    { key: "anniversary", label: Locale.label("person.anniversary"), shortName: Locale.label("person.anniversary") },
    { key: "nametagNotes", label: Locale.label("people.peoplePage.nameNote"), shortName: Locale.label("common.notes") },
    { key: "deleteOption", label: Locale.label("people.peoplePage.deleteOp"), shortName: Locale.label("common.delete") },
  ];

  const handleToggleColumn = (key: string) => {
    const sc = [...selectedColumns];
    const index = sc.indexOf(key);
    if (index === -1) sc.push(key);
    else sc.splice(index, 1);
    sessionStorage.setItem("selectedColumns", JSON.stringify(sc));
    setSelectedColumns(sc);
  };

  // Removed getEditContent - functionality moved to header

  React.useEffect(() => {
    if (sessionStorage.getItem("selectedColumns")) {
      setSelectedColumns(JSON.parse(sessionStorage.getItem("selectedColumns")));
    } else {
      sessionStorage.setItem("selectedColumns", JSON.stringify(["photo", "displayName"]));
    }
  }, []);

  React.useEffect(() => {
    const loadData = () => {
      ApiHelper.get("/people/recent", "MembershipApi").then((data) => {
        if (!isMounted()) {
          return;
        }
        setSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)));
        setIsSearchPerformed(false); // Reset to show this is recent data, not search results
      });
    };

    loadData();
  }, [isMounted]);

  return (
    <>
      <PageHeader
        icon={<PeopleIcon />}
        title={Locale.label("people.peoplePage.searchPpl")}
        subtitle={searchResults ? (isSearchPerformed ? `Found ${searchResults.length} people` : `Showing ${searchResults.length} most recent people`) : "Loading people..."}
      >
        <SearchIcon
          sx={{
            fontSize: 32,
            color: "rgba(255,255,255,0.8)",
            cursor: "pointer",
            "&:hover": {
              color: "#FFF",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease",
            mr: 2,
          }}
          onClick={() => {
            const searchPanel = document.getElementById("peopleSearch");
            if (searchPanel) {
              searchPanel.scrollIntoView({ behavior: "smooth", block: "start" });
              // Focus on the search input after scrolling
              setTimeout(() => {
                const searchInput = document.getElementById("searchText") || document.querySelector('[data-testid="people-search-input"]');
                if (searchInput) {
                  (searchInput as HTMLElement).focus();
                }
              }, 500);
            }
          }}
        />
        <Button
          variant="outlined"
          sx={{
            color: "#FFF",
            borderColor: "rgba(255,255,255,0.5)",
            "&:hover": {
              borderColor: "#FFF",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
          startIcon={<PersonAddIcon />}
          onClick={() => {
            // Scroll to the CreatePerson component at the bottom
            const createPersonSection = document.querySelector('[data-cy="createPerson"]') || document.querySelector(".create-person") || document.getElementById("createPersonForm");
            if (createPersonSection) {
              createPersonSection.scrollIntoView({ behavior: "smooth", block: "start" });
              // Focus on first input field after scrolling
              setTimeout(() => {
                const firstInput = createPersonSection.querySelector("input") as HTMLElement;
                if (firstInput) {
                  firstInput.focus();
                }
              }, 500);
            } else {
              // Fallback: scroll to bottom of page
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }
          }}
        >
          Add Person
        </Button>
      </PageHeader>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <PeopleSearch
              updateSearchResults={(people) => {
                setSearchResults(people);
                setIsSearchPerformed(true);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Card>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PeopleIcon />
                    <Typography variant="h6">{isSearchPerformed ? "Search Results" : Locale.label("people.peoplePage.recentPpl")}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {searchResults && (
                      <Button size="small" variant="outlined" startIcon={<ExportIcon />} component={ExportLink} data={searchResults} filename="people.csv" sx={{ mr: 1 }}>
                        Export
                      </Button>
                    )}
                    <PeopleColumns selectedColumns={selectedColumns} toggleColumn={handleToggleColumn} columns={columns} />
                  </Stack>
                </Stack>
              </Box>
              <Box>
                <PeopleSearchResults people={searchResults} columns={columns} selectedColumns={selectedColumns} updateSearchResults={(people) => setSearchResults(people)} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
});
