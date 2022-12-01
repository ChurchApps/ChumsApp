import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import React, { useState, useEffect } from "react"
import { PersonAdd, PersonInterface, PersonHelper } from "."
import { SmallButton } from "../../appBase/components";

interface Props {
  person: PersonInterface,
  handleAssociatePerson: (person: PersonInterface) => void,
  searchStatus: (value: boolean) => void,
  filterList?: string[]
  onChangeClick?: () => void;
  showChangeOption?: boolean;
}

export const AssociatePerson = ({ person, handleAssociatePerson, searchStatus, filterList, onChangeClick = () => { }, showChangeOption = true }: Props) => {
  const [showSearchPerson, setShowSearchPerson] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    setShowSearchPerson(false);
    setHasSearched(false);
  }, [person])

  const searchClicked = () => {
    setHasSearched(true);
  }

  const handleChangeClick = () => {
    setShowSearchPerson(true);
    onChangeClick();
  }

  useEffect(() => {
    searchStatus(hasSearched);
  }, [hasSearched, searchStatus])

  if (!person || showSearchPerson) return <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={handleAssociatePerson} searchClicked={searchClicked} filterList={filterList} includeEmail={true} />;
  return (
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell><img src={PersonHelper.getPhotoUrl(person)} width="60px" height="45px" style={{ borderRadius: "5px" }} alt="avatar" /></TableCell>
          <TableCell className="border-0">{person?.name?.display}</TableCell>
          {showChangeOption && <TableCell className="border-0"><SmallButton data-cy="change-person" onClick={handleChangeClick} text="Change" icon="person" /></TableCell>}
        </TableRow>
      </TableBody>
    </Table>
  )
}
