"use client";

import React, { useState } from "react";

import { type PersonInterface } from "@churchapps/helpers";
import { TextField, Button, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { ApiHelper, Locale } from "@churchapps/apphelper";
import { PersonAddResults } from "./PersonAddResults";
import { PersonEdit } from "./PersonEdit";

interface Props {
  addFunction: (person: PersonInterface) => void;
  person?: PersonInterface;
  getPhotoUrl: (person: PersonInterface) => string;
  searchClicked?: () => void;
  filterList?: string[];
  includeEmail?: boolean;
  actionLabel?: string;
  showCreatePersonOnNotFound?: boolean;
}

export const PersonAdd: React.FC<Props> = ({
  addFunction, getPhotoUrl, searchClicked, filterList = [], includeEmail = false, actionLabel, showCreatePersonOnNotFound = false 
}) => {
  const [searchResults, setSearchResults] = useState<PersonInterface[]>([]);
  const [searchText, setSearchText] = useState("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setHasSearched(false);
    setSearchText(e.currentTarget.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(null);
    }
  };

  const handleSearch = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    const term = searchText.trim();
    ApiHelper.post("/people/search", { term: term }, "MembershipApi").then((data: PersonInterface[]) => {
      setHasSearched(true);
      const filteredResult = data.filter((s) => !filterList.includes(s.id));
      setSearchResults(filteredResult);
      if (searchClicked) {
        searchClicked();
      }
    });
  };
  return (
    <>
      <TextField
        fullWidth
        name="personAddText"
        label={Locale.label("person.person")}
        value={searchText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        data-testid="person-add-search-input"
        aria-label="Search for person to add"
        InputProps={{
          endAdornment: (
            <Button variant="contained" id="searchButton" data-cy="search-button" onClick={handleSearch} data-testid="person-add-search-button" aria-label="Search for person">
              {Locale.label("common.search")}
            </Button>
          ),
        }}
      />
      {showCreatePersonOnNotFound && hasSearched && searchText && searchResults.length === 0 && (
        <Typography sx={{ marginTop: "7px" }}>
          {Locale.label("person.noRec")}{" "}
          <a
            href="about:blank"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            data-testid="create-new-person-link"
            aria-label="Create new person">
            {Locale.label("createPerson.addNewPerson")}
          </a>
        </Typography>
      )}
      <PersonAddResults addFunction={addFunction} getPhotoUrl={getPhotoUrl} includeEmail={includeEmail} actionLabel={actionLabel} searchResults={searchResults} />
      {open && (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{Locale.label("createPerson.addNewPerson")}</DialogTitle>
          <DialogContent>
            <PersonEdit
              person={{
                name: {
                  first: "",
                  last: "",
                  middle: "",
                  nick: "",
                  display: "",
                },
                contactInfo: {
                  address1: "",
                  address2: "",
                  city: "",
                  state: "",
                  zip: "",
                  email: "",
                  homePhone: "",
                  workPhone: "",
                  mobilePhone: "",
                },
                membershipStatus: "",
                gender: "",
                birthDate: null,
                maritalStatus: "",
                nametagNotes: "",
              }}
              updatedFunction={() => {
                setOpen(false);
                setSearchText("");
                // Refresh search results after creating
                handleSearch(null);
              }}
              togglePhotoEditor={() => {}}
              showMergeSearch={() => {}}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
