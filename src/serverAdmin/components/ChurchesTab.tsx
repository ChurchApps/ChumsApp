import React from "react";
import { ApiHelper, DisplayBox, UserHelper, DateHelper, ArrayHelper, Locale } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import UserContext from "../../UserContext";
import { type ChurchInterface } from "@churchapps/apphelper";


export const ChurchesTab = () => {
  const [searchText, setSearchText] = React.useState<string>("")
  const [churches, setChurches] = React.useState<ChurchInterface[]>([]);
  const [redirectUrl, setRedirectUrl] = React.useState<string>("");

  const context = React.useContext(UserContext);

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
      const activeLink = (c.archivedDate)
        ? <a href="about:blank" className="text-danger" onClick={(e) => { e.preventDefault(); handleArchive(currentChurch); }}>{Locale.label("serverAdmin.adminPage.arch")}</a>
        : <a href="about:blank" className="text-success" onClick={(e) => { e.preventDefault(); handleArchive(currentChurch); }}>{Locale.label("serverAdmin.adminPage.act")}</a>

      result.push(<tr key={index}>
        <td>{getManageAccessLink(c)}</td>
        <td>{DateHelper.prettyDate(DateHelper.toDate(c.registrationDate))}</td>
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
    const anchor = e.currentTarget as HTMLAnchorElement;
    const churchId = anchor.getAttribute("data-churchid");

    const result = await ApiHelper.get("/churches/" + churchId + "/impersonate", "MembershipApi");

    const idx = ArrayHelper.getIndex(UserHelper.userChurches, "church.id", churchId);
    if (idx > -1) UserHelper.userChurches.splice(idx, 1);

    UserHelper.userChurches.push(...result.userChurches);
    UserHelper.selectChurch(context, result.userChurches[0].church.id, null)
    setRedirectUrl(`/settings`);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); loadData(); } }

  React.useEffect(loadData, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else return (
    <>
      <DisplayBox headerIcon="church" headerText={Locale.label("serverAdmin.adminPage.churches")}>
        <TextField fullWidth variant="outlined" name="searchText" label={Locale.label("serverAdmin.adminPage.churchName")} value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} data-testid="church-search-input" aria-label="Church name search"
          InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" disableElevation onClick={loadData} data-testid="search-churches-button" aria-label="Search churches">{Locale.label("common.search")}</Button> }}
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
    </>
  );

}
