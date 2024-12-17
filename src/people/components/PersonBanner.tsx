import { PersonHelper, PersonInterface } from "@churchapps/apphelper";
import { Button, Grid } from "@mui/material";
import React from "react";

interface Props {
  person:PersonInterface
}

export const PersonBanner = (props:Props) => {
  const a="";
  const phone = props.person?.contactInfo?.mobilePhone || props.person?.contactInfo?.homePhone || props.person?.contactInfo?.workPhone || "";
  const email = props.person?.contactInfo?.email || props.person?.contactInfo?.workEmail || "";

  return (<div style={{backgroundColor:"#568BDA", color: "#FFF", padding:"12px 24px"}}>

    <Grid container spacing={2}>
      <Grid item md={1} xs={12} sx={{display:"flex", justifyContent: {xs:"center", sm:"flex-start"}}}>
        <img src={PersonHelper.getPhotoUrl(props.person)} alt={props.person?.name?.display} style={{width:100, height:100, objectFit:"cover", borderRadius: "50%", border:"5px solid #FFF", float:"left", marginRight:30}} />
      </Grid>
      <Grid item md={7} xs={12} sx={{textAlign: {xs:"center", sm:"left"}}}>
        <h1 style={{borderBottom:"none", fontSize:30, fontWeight:"normal", marginBottom:0, lineHeight:1}}>{props.person?.name?.display}</h1>
        <div>
          {(phone) && <>{phone}  &nbsp; </>}
          {(email) && <>{email}  &nbsp; </>}
        </div>
      </Grid>
      <Grid item md={4} xs={12} style={{textAlign:"right", display:"flex", alignItems:"center"}} sx={{display:"flex", justifyContent: {xs:"center", sm:"flex-end"}}}>
        <Button variant="contained" color="success">{props.person?.membershipStatus}</Button>
      </Grid>
    </Grid>

  </div>);
}
