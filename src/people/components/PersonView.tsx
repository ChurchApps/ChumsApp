import React from "react";
import { AssociatedForms } from "."
import { PersonHelper, PersonInterface, Loading, DisplayBox, DateHelper, Locale } from "@churchapps/apphelper"
import { Grid, Icon, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { formattedPhoneNumber } from "./PersonEdit";

interface Props {
  id?: string,
  person: PersonInterface
  editFunction: () => void,
  updatedFunction: () => void
}

export const PersonView = ({ id, person, editFunction, updatedFunction }: Props) => {
  const getFields = () => {
    if (!person) return <Loading />
    else {

      let leftAttributes = [];
      let contactMethods = [];
      if (person) {
        const p = { ...person };
        if (p.gender && p.gender !== "Unspecified") leftAttributes.push(<div key="gender"><label>{Locale.label("people.personView.gender")}</label> <b>{p.gender}</b></div>);
        if (p.birthDate) leftAttributes.push(<div key="age"><label>{Locale.label("people.personView.age")}</label> <b>{PersonHelper.getAge(p.birthDate)}</b></div>);
        if (p.maritalStatus && p.maritalStatus !== "Single") {
          if (p.anniversary) leftAttributes.push(<div key="maritalStatus"><label>{Locale.label("people.personView.marStat")}</label> <b>{p.maritalStatus} ({DateHelper.getShortDate(DateHelper.toDate(p.anniversary))})</b></div>);
          else leftAttributes.push(<div key="maritalStatus"><label>{Locale.label("people.personView.marStat")}</label> <b>{p.maritalStatus}</b></div>);
        }
        if (p.membershipStatus) leftAttributes.push(<div key="membership"><label>{Locale.label("people.personView.memShip")}</label> <b>{p.membershipStatus}</b></div>);

        let homeLabel = "Home";
        if (p.contactInfo.email) {
          contactMethods.push(<TableRow key="email"><TableCell><label>{homeLabel}</label></TableCell><TableCell><Icon>mail</Icon></TableCell><TableCell><a href={"mailto:" + p.contactInfo.email}><b>{p.contactInfo.email}</b></a></TableCell></TableRow>);
          homeLabel = "";
        }
        if (p.contactInfo.homePhone) {
          contactMethods.push(<TableRow key="homePhone"><TableCell><label>{homeLabel}</label></TableCell><TableCell><Icon>call</Icon></TableCell><TableCell><b>{formattedPhoneNumber(p.contactInfo.homePhone)}</b></TableCell></TableRow>);
          homeLabel = "";
        }

        if (p.contactInfo.address1) {
          let lines = [];
          lines.push(<div key="address1"><b>{p.contactInfo.address1}</b></div>);
          if (p.contactInfo.address2) lines.push(<div key="address2"><b>{p.contactInfo.address2}</b></div>);
          lines.push(<div key="contactInfo">{p.contactInfo.city}, {p.contactInfo.state} {p.contactInfo.zip}</div>);

          contactMethods.push(<TableRow key="address"><TableCell><label>{homeLabel}</label></TableCell><TableCell><Icon>home_pin</Icon></TableCell><TableCell>{lines}</TableCell></TableRow>);
        }
        if (p.contactInfo.mobilePhone) contactMethods.push(<TableRow key="mobilePHone"><TableCell><label>{Locale.label("people.personView.mobile")}</label></TableCell><TableCell><Icon>phone_iphone</Icon></TableCell><TableCell><b>{formattedPhoneNumber(p.contactInfo.mobilePhone)}</b></TableCell></TableRow>);
        if (p.contactInfo.workPhone) contactMethods.push(<TableRow key="workPhone"><TableCell><label>{Locale.label("people.personView.work")}</label></TableCell><TableCell><Icon>call</Icon></TableCell><TableCell><b>{formattedPhoneNumber(p.contactInfo.workPhone)}</b></TableCell></TableRow>);
      }

      return (<Grid container spacing={3}>
        <Grid item xs={3}>
          <img style={{ width: "100%" }} src={PersonHelper.getPhotoUrl(person)} className="profilePic" aria-label="personImage" id="imgPreview" alt="avatar" />
        </Grid>
        <Grid item xs={9}>
          <h2>{person?.name.display}</h2>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>{leftAttributes}</Grid>
            <Grid item md={6} xs={12}><Table className="contactTable"><TableBody>{contactMethods}</TableBody></Table></Grid>
          </Grid>
        </Grid>
      </Grid>);
    }
  }

  return (
    <DisplayBox headerText={Locale.label("people.personView.persDet")} editFunction={editFunction} footerContent={<AssociatedForms contentType="person" contentId={person?.id} formSubmissions={person?.formSubmissions} updatedFunction={updatedFunction} />}>
      {getFields()}
    </DisplayBox>
  )
}
