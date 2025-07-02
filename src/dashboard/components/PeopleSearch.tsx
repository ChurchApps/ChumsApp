import React from "react";
import {
 Button, FormControl, InputLabel, OutlinedInput, Card, CardContent, Typography, Box, Stack 
} from "@mui/material";
import { Person as PersonIcon, Search as SearchIcon } from "@mui/icons-material";
import { ChumsPersonHelper } from "../../helpers";
import { ApiHelper, Locale, type PersonInterface, SearchCondition } from "@churchapps/apphelper";
import { PeopleSearchResults } from "../../people/components";

export const PeopleSearch = () => {
  const [searchResults, setSearchResults] = React.useState(null);
  const [searchText, setSearchText] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const selectedColumns = ["photo", "displayName"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = async (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    const term = searchText.trim();
    if (!term) return;

    setIsSearching(true);
    try {
      const condition: SearchCondition = { field: "displayName", operator: "contains", value: term };
      const data: PersonInterface[] = await ApiHelper.post("/people/advancedSearch", [condition], "MembershipApi");
      setSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  const columns = [{ key: "photo", label: Locale.label("dashboard.peopleSearch.photo"), shortName: "" }, { key: "displayName", label: Locale.label("dashboard.peopleSearch.display"), shortName: Locale.label("common.name") }];

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <PersonIcon
            sx={{
              color: "primary.main",
              fontSize: 24,
            }}
          />
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {Locale.label("dashboard.peopleSearch.ppl")}
          </Typography>
        </Stack>

        {/* Search Form */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="searchText">{Locale.label("common.name")}</InputLabel>
            <OutlinedInput
              id="searchText"
              aria-label="searchBox"
              name="searchText"
              type="text"
              label={Locale.label("common.name")}
              value={searchText}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              data-testid="dashboard-people-search-input"
              endAdornment={
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  data-testid="dashboard-search-button"
                  aria-label="Search people"
                  disabled={isSearching || !searchText.trim()}
                  startIcon={<SearchIcon />}
                  sx={{
                    ml: 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  {isSearching ? Locale.label("common.searching") || "Searching..." : Locale.label("common.search")}
                </Button>
              }
            />
          </FormControl>
        </Box>

        {/* Search Results */}
        {searchResults && (
          <Box sx={{ mt: 2 }}>
            <PeopleSearchResults people={searchResults} columns={columns} selectedColumns={selectedColumns} />
          </Box>
        )}

        {searchResults && searchResults.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 3,
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">No people found matching your search criteria.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
