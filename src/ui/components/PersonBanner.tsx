import { Button, Grid } from "@mui/material";
import React from "react";

export const PersonBanner: React.FC = () => {
  const a="";

  return (<div style={{backgroundColor:"#568BDA", color: "#FFF", padding:"12px 24px"}}>

    <Grid container spacing={2}>
      <Grid item xs={8}>
        <img src="https://content.churchapps.org/Hchi650pfrH/membership/people/rNW0TQFFJ00.png?dt=1654567191000" alt="Jeremy Zongker" style={{width:100, height:100, objectFit:"cover", borderRadius: "50%", border:"5px solid #FFF", float:"left", marginRight:30}} />
        <h1 style={{borderBottom:"none", fontSize:30, fontWeight:"normal", marginBottom:0, lineHeight:1}}>Jeremy Zongker</h1>
        <div>918-282-2011 &nbsp; jeremy@zongker.net</div>
      </Grid>
      <Grid item xs={4} style={{textAlign:"right", display:"flex", alignItems:"center", justifyContent:"end"}}>
        <Button variant="contained" color="success">MEMBER</Button>
      </Grid>
    </Grid>

  </div>);
}
