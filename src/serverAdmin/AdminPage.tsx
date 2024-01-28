import React from "react";
import { ApiHelper, DisplayBox, UserHelper, DateHelper, ArrayHelper } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";
import { Grid, TextField, Button, Icon } from "@mui/material";
import UserContext from "../UserContext";
import { ReportWithFilter, ChurchInterface } from "@churchapps/apphelper";

export const AdminPage = () => {
  const [searchText, setSearchText] = React.useState<string>("")
  const [churches, setChurches] = React.useState<ChurchInterface[]>([]);
  const [redirectUrl, setRedirectUrl] = React.useState<string>("");

  let context = React.useContext(UserContext);

  const loadData = () => {
    const term = escape(searchText.trim());
    ApiHelper.get("/churches/all?term=" + term, "MembershipApi").then(data => setChurches(data));
  }

  const handleArchive = (church: ChurchInterface) => {
    const tmpChurches = [...churches];
    const c = ArrayHelper.getOne(tmpChurches, "id", church.id)
    if (c.archivedDate) c.archivedDate = null;
    else c.archivedDate = new Date();

    ApiHelper.post("/churches/" + church.id + "/archive", { archived: c.archivedDate !== null }, "MembershipApi");

    setChurches(tmpChurches);
  }

  const getChurchRows = () => {
    console.log("getChurchRows")
    if (churches === null) return;
    const result: JSX.Element[] = [];
    churches.forEach((c, index) => {

      const currentChurch = c;
      let activeLink = (c.archivedDate)
        ? <a href="about:blank" className="text-danger" onClick={(e) => { e.preventDefault(); handleArchive(currentChurch); }}>Archived</a>
        : <a href="about:blank" className="text-success" onClick={(e) => { e.preventDefault(); handleArchive(currentChurch); }}>Active</a>

      result.push(<tr key={index}>
        <td>{getManageAccessLink(c)}</td>
        <td>{DateHelper.prettyDate(DateHelper.convertToDate(c.registrationDate))}</td>
        <td>{activeLink}</td>
      </tr>);
    });
    result.unshift(<tr><th>Church</th><th>Registered</th><th>Active</th></tr>)
    return result;

  }

  const getManageAccessLink = (church: ChurchInterface) => {
    let result: JSX.Element = null;
    result = (<a href="about:blank" data-churchid={church.id} onClick={handleEditAccess} style={{ marginRight: 40 }}>{church.name}</a>);
    return result;
  }

  const handleEditAccess = async (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let churchId = anchor.getAttribute("data-churchid");

    const result = await ApiHelper.get("/churches/" + churchId + "/impersonate", "MembershipApi");

    const idx = ArrayHelper.getIndex(UserHelper.userChurches, "church.id", churchId);
    if (idx > -1) UserHelper.userChurches.splice(idx, 1);

    UserHelper.userChurches.push(...result.userChurches);

    UserHelper.selectChurch(context, result.userChurches[0].id, null)

    setRedirectUrl(`/settings`);

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); loadData(); } }

  React.useEffect(loadData, []); //eslint-disable-line

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else return (
    <>
      <h1><Icon>admin_panel_settings</Icon> Server Admin</h1>

      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox headerIcon="church" headerText="Churches">
            <TextField fullWidth variant="outlined" name="searchText" label="Church Name" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown}
              InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" disableElevation onClick={loadData}>Search</Button> }}
            />
            <br />
            {
              churches.length === 0
                ? <>No church found.  Please search for a different name.</>
                : (
                  <table className="table table-sm" id="adminChurchesTable">
                    {getChurchRows()}
                  </table>
                )
            }
          </DisplayBox>
        </Grid>
        <Grid item md={4} xs={12}>

        </Grid>
      </Grid>
      <ReportWithFilter keyName="usageTrends" autoRun={true} />
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox headerIcon="summarize" headerText="Notes on How Values are Calculated">
            <ul>
              <li><b>Chums</b> - Comparable software is Breeze.  They charge $72/mo or $864/year.</li>
              <li><b>B1</b> - Comparable software is SubSplash.  They start at $99/mo or $1200/year.  This does not include the cut they take on donations.</li>
              <li><b>Lessons</b> - Comparable content is Orange.  They charge $1023/year for churches with 26-50 viewers for 252 Basic.</li>
              <li><b>FreeShow</b> - Comparable software is ProPresenter.  It's $399 for a site license.  I made assumptions that the average church installs the software on 3 computers and divided our total installs by 3 to get the number of churches.  I also made the assumption that churches will upgrade to a newer version every 5 years on average.  So $399 / 5 years / 3 computers = $26.60 annual cost per computer.  If we can quantify these assumptions we should update this number.</li>
            </ul>
          </DisplayBox>

        </Grid>
      </Grid>
    </>
  );

}
