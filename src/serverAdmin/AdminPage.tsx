import React from "react";
import { ApiHelper, DisplayBox, UserHelper, DateHelper, ArrayHelper, Locale } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";
import { Grid, TextField, Button, Icon } from "@mui/material";
import UserContext from "../UserContext";
import { ReportWithFilter, ChurchInterface } from "@churchapps/apphelper";
import { Banner } from "../baseComponents/Banner";

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
        ? <a href="about:blank" className="text-danger" onClick={(e) => { e.preventDefault(); handleArchive(currentChurch); }}>{Locale.label("serverAdmin.adminPage.arch")}</a>
        : <a href="about:blank" className="text-success" onClick={(e) => { e.preventDefault(); handleArchive(currentChurch); }}>{Locale.label("serverAdmin.adminPage.act")}</a>

      result.push(<tr key={index}>
        <td>{getManageAccessLink(c)}</td>
        <td>{DateHelper.prettyDate(DateHelper.convertToDate(c.registrationDate))}</td>
        <td>{activeLink}</td>
      </tr>);
    });
    result.unshift(<tr><th>{Locale.label("serverAdmin.adminPage.church")}</th><th>{Locale.label("serverAdmin.adminPage.regist")}</th><th>{Locale.label("serverAdmin.adminPage.act")}</th></tr>)
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
    UserHelper.selectChurch(context, result.userChurches[0].church.id, null)
    setRedirectUrl(`/settings`);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); loadData(); } }

  React.useEffect(loadData, []); //eslint-disable-line

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else return (
    <>
      <Banner><h1>{Locale.label("serverAdmin.adminPage.servAdmin")}</h1></Banner>
      <div id="mainContent">
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <DisplayBox headerIcon="church" headerText={Locale.label("serverAdmin.adminPage.churches")}>
              <TextField fullWidth variant="outlined" name="searchText" label={Locale.label("serverAdmin.adminPage.churchName")} value={searchText} onChange={handleChange} onKeyDown={handleKeyDown}
                InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" disableElevation onClick={loadData}>{Locale.label("common.search")}</Button> }}
              />
              <br />
              {
                churches.length === 0
                  ? <>{Locale.label("serverAdmin.adminPage.noChurch")}</>
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
            <DisplayBox headerIcon="summarize" headerText={Locale.label("serverAdmin.adminPage.valueNotes")}>
              <ul>
                <li><b>Chums</b> - {Locale.label("serverAdmin.adminPage.noteOne")}</li>
                <li><b>B1</b> - {Locale.label("serverAdmin.adminPage.noteTwo")}</li>
                <li><b>Lessons</b> - {Locale.label("serverAdmin.adminPage.noteThree")}</li>
                <li><b>FreeShow</b> - {Locale.label("serverAdmin.adminPage.noteFour")}</li>
              </ul>
            </DisplayBox>

          </Grid>
        </Grid>
      </div>
    </>
  );

}
