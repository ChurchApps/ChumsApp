import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChumsPersonHelper } from ".";
import { PersonHelper, PersonInterface, Loading, CreatePerson, DateHelper } from "@churchapps/apphelper";
import { Table, TableBody, TableRow, TableCell, TableHead, Tooltip } from "@mui/material"

interface Props {
  people: PersonInterface[],
  columns: { key: string, label: string, shortName: string }[],
  selectedColumns: string[],
}

export function PeopleSearchResults(props: Props) {
  let { people, columns, selectedColumns } = props;

  const [sortDirection, setSortDirection] = useState<boolean | null>(null)
  const [currentSortedCol, setCurrentSortedCol] = useState<string>("")

  const getColumns = (p: PersonInterface) => {
    const result: JSX.Element[] = [];
    columns.forEach(c => {
      if (selectedColumns.indexOf(c.key) > -1) {
        result.push(<TableCell key={c.key}>{getColumn(p, c.key)}</TableCell>);
      }
    })
    return result;
  }

  const getPhotoJSX = (p: PersonInterface) => {
    const photoUrl = PersonHelper.getPhotoUrl(p);
    if (photoUrl === "/images/sample-profile.png") {
      return <img src={photoUrl} alt="avatar" />
    } else {
      return <Tooltip componentsProps={{ tooltip: { sx: { padding: "0" } } }} title={<div dangerouslySetInnerHTML={{ __html: '<img src="' + photoUrl + '" style="max-width: 200px"/>' }} />} arrow placement="right"><a href={photoUrl} target="_blank" rel="noreferrer"><img src={photoUrl} alt="avatar" /></a></Tooltip>
    }
  }

  const getColumn = (p: PersonInterface, key: string) => {
    let result = <></>;
    switch (key) {
      case "photo": result = (getPhotoJSX(p)); break;
      case "displayName": result = (<Link to={"/people/" + p.id.toString()}>{p.name.display}</Link>); break;
      case "lastName": result = (<>{p.name.last}</>); break;
      case "firstName": result = (<>{p.name.first}</>); break;
      case "middleName": result = (<>{p.name.middle}</>); break;
      case "address": result = (<>{p.contactInfo.address1}</>); break;
      case "city": result = (<>{p.contactInfo.city}</>); break;
      case "state": result = (<>{p.contactInfo.state}</>); break;
      case "zip": result = (<>{p.contactInfo.zip}</>); break;
      case "email": result = (<>{p.contactInfo.email}</>); break;
      case "phone": result = (<>{p.contactInfo.mobilePhone || p.contactInfo.homePhone || p.contactInfo.workPhone}</>); break;
      case "birthDate": result = (<>{(p.birthDate === null) ? "" : ChumsPersonHelper.getDateStringFromDate(p.birthDate)}</>); break;
      case "birthDay": result = (<>{ChumsPersonHelper.getBirthDay(p)}</>); break;
      case "age": result = (<>{(p.birthDate === null) ? "" : PersonHelper.getAge(p.birthDate).split(" ")[0]}</>); break;
      case "gender": result = (<>{p.gender}</>); break;
      case "membershipStatus": result = (<>{p.membershipStatus}</>); break;
      case "maritalStatus": result = (<>{p.maritalStatus}</>); break;
      case "anniversary": result = (<>{(p.anniversary === null) ? "" : ChumsPersonHelper.getDateStringFromDate(p.anniversary)}</>); break;

    }

    return result;
  }

  const sortTableByKey = (key: string, asc: boolean | null) => {
    if (asc === null) asc = false;
    setCurrentSortedCol(key)
    setSortDirection(!asc) //set sort direction for next time
    people = people.sort(function (a: any, b: any) {
      if (a[key] === null) return Infinity; // if value is null push to the end of array

      if (typeof a[key].getMonth === "function") {
        return asc ? (a[key]?.getTime() - b[key]?.getTime()) : (b[key]?.getTime() - a[key]?.getTime());
      }

      const parsedNum = parseInt(a[key]);
      if (!isNaN(parsedNum)) { return asc ? (a[key] - b[key]) : (b[key] - a[key]); }

      const valA = a[key].toUpperCase();
      const valB = b[key].toUpperCase();
      if (valA < valB) {
        return asc ? 1 : -1;
      }
      if (valA > valB) {
        return asc ? -1 : 1;
      }
      // equal
      return 0;
    });
  }

  const getRows = () => {
    const result: JSX.Element[] = people?.map(p => (
      <TableRow key={p.id}>
        {getColumns(p)}
      </TableRow>
    ));
    return result;
  }

  const getHeaders = () => {
    const result: JSX.Element[] = [];
    columns.forEach(c => {
      if (selectedColumns.indexOf(c.key) > -1) {
        result.push(
          <th key={c.key} onClick={() => sortTableByKey(c.key, sortDirection)}>
            <span style={{ float: "left" }}>{c.shortName}</span>
            {c.key !== "photo"
              && <div style={{ display: "flex" }}>
                <div style={{ marginTop: "5px" }} className={`${sortDirection && currentSortedCol === c.key ? "sortAscActive" : "sortAsc"}`}></div>
                <div style={{ marginTop: "14px" }} className={`${!sortDirection && currentSortedCol === c.key ? "sortDescActive" : "sortDesc"}`}></div>
              </div>
            }
          </th>)
      }
    })

    return <TableHead><TableRow>{result}</TableRow></TableHead>;
  }

  const getResults = () => {
    if (people.length === 0) return <p>No results found.  Please search for a different name or add a new person</p>
    else return (<Table id="peopleTable">
      {getHeaders()}
      <TableBody>{getRows()}</TableBody>
    </Table>);
  }

  if (!people) return <Loading />;
  return (
    <div>
      {getResults()}
      <hr />
      <CreatePerson />
    </div>
  )
}
