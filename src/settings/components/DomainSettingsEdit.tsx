import React from "react";
import { ArrayHelper, DomainInterface, ApiHelper, Locale } from "@churchapps/apphelper";
import { TextField, Grid, TableCell, TableBody, TableRow, Table, TableHead } from "@mui/material";

interface Props { churchId: string, saveTrigger: Date | null }

export const DomainSettingsEdit: React.FC<Props> = (props) => {
  const [domains, setDomains] = React.useState<DomainInterface[]>([]);
  const [originalDomains, setOriginalDomains] = React.useState<DomainInterface[]>([]);
  const [addDomainName, setAddDomainName] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    switch (e.target.name) {
      case "domainName": setAddDomainName(e.target.value); break;
    }
  }

  const save = () => {
    for (const d of originalDomains) {
      if (!ArrayHelper.getOne(domains, "id", d.id)) ApiHelper.delete("/domains/" + d.id, "MembershipApi");
    }

    for (const d of domains) {
      const toAdd: DomainInterface[] = []
      if (!d.id) toAdd.push(d);
      if (toAdd.length > 0) ApiHelper.post("/domains", toAdd, "MembershipApi");
    }
  }

  const checkSave = () => {
    if (props.saveTrigger !== null) save()
  };

  const loadData = async () => {
    const data = await ApiHelper.get("/domains", "MembershipApi");;
    setOriginalDomains(data);
    setDomains(data);
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const doms: DomainInterface[] = [...domains]
    doms.push({ domainName: addDomainName })
    setDomains(doms);
    setAddDomainName("");
  }

  const handleDelete = (index: number) => {
    const doms: DomainInterface[] = [...domains]
    doms.splice(index, 1);
    setDomains(doms);
  }

  const getRows = () => {
    const result: JSX.Element[] = []
    let idx = 0;
    domains.forEach(d => {
      const index = idx;
      result.push(<TableRow>
        <TableCell>
          {d.domainName}
        </TableCell>
        <TableCell>
          <a href="about:blank" onClick={(e) => { e.preventDefault(); handleDelete(index) }}>{Locale.label("common.delete")}</a>
        </TableCell>
      </TableRow>);
      idx++
    });
    return result;
  }

  const relink = (e: React.MouseEvent) => {
    e.preventDefault();
    ApiHelper.get("/domains/caddy", "MembershipApi").then((data) => {
      alert("Done.  Please only click this link once.");
    });
  }

  React.useEffect(() => { if (props.churchId) loadData() }, [props.churchId]);  
  React.useEffect(checkSave, [props.saveTrigger]); //eslint-disable-line


  return (
    <>
      {/* <div className="subHead">{Locale.label("settings.domainSettingsEdit.domains")}</div> */}
      <p style={{fontSize:12}}>
        {Locale.label("settings.domainSettingsEdit.domMsg")} <i style={{ fontSize: 12 }}>CNAME: proxy.b1.church</i>
        {Locale.label("settings.domainSettingsEdit.domMsg2")} <i style={{ fontSize: 12 }}>A: 3.23.251.61</i>
        {Locale.label("settings.domainSettingsEdit.domMsg3")} <a href="about:blank" onClick={relink}>{Locale.label("settings.domainSettingsEdit.domMsgConnect")}</a>
        {Locale.label("settings.domainSettingsEdit.domMsg4")}
      </p>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{Locale.label("settings.domainSettingsEdit.domain")}</TableCell>
                <TableCell>{Locale.label("settings.domainSettingsEdit.act")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getRows()}
              <TableRow>
                <TableCell>
                  <TextField fullWidth name="domainName" size="small" value={addDomainName} onChange={handleChange} placeholder="yoursite.com" />
                </TableCell>
                <TableCell>
                  <a href="about:blank" onClick={handleAdd}>{Locale.label("common.add")}</a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>

    </>
  );
}
