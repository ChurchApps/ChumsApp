import React from "react";
import { ApiHelper } from ".";
import { ArrayHelper, DomainInterface, PaymentGatewaysInterface, UniqueIdHelper } from "../../helpers";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Grid, TableCell, TableBody, TableRow, Table, TableHead } from "@mui/material";
import { SmallButton } from "../../appBase/components";

interface Props { churchId: string, saveTrigger: Date | null }

export const DomainSettingsEdit: React.FC<Props> = (props) => {
  const [domains, setDomains] = React.useState<DomainInterface[]>([]);
  const [originalDomains, setOriginalDomains] = React.useState<DomainInterface[]>([]);
  const [addDomainName, setAddDomainName] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    switch (e.target.name) {
      case "domainName": setAddDomainName(e.target.value); break;
    }
  }

  const save = () => {
    for (let d of originalDomains) {
      if (!ArrayHelper.getOne(domains, "id", d.id)) ApiHelper.delete("/domains/" + d.id, "MembershipApi");
    }

    for (let d of domains) {
      let toAdd: DomainInterface[] = []
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
    let result: JSX.Element[] = []
    let idx = 0;
    domains.forEach(d => {
      const index = idx;
      result.push(<TableRow>
        <TableCell>
          {d.domainName}
        </TableCell>
        <TableCell>
          <a href="about:blank" onClick={(e) => { e.preventDefault(); handleDelete(index) }}>Delete</a>
        </TableCell>
      </TableRow>);
      idx++
    });
    return result;
  }

  React.useEffect(() => { if (props.churchId) loadData() }, [props.churchId]); //eslint-disable-line
  React.useEffect(checkSave, [props.saveTrigger]); //eslint-disable-line

  return (
    <>
      <div className="subHead">Domains</div>
      <p>You can make your B1 website answer for any custom domain you wish.  Enter the associated domain name here and then add the following record to your DNS: <i style={{ fontSize: 12 }}>CNAME: proxy.b1.church</i></p>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Domain</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getRows()}
              <TableRow>
                <TableCell>
                  <TextField fullWidth name="domainName" size="small" value={addDomainName} onChange={handleChange} placeholder="yoursite.com" />
                </TableCell>
                <TableCell>
                  <a href="about:blank" onClick={handleAdd}>Add</a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>

    </>
  );
}
