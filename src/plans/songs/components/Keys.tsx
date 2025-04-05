import React, { useEffect } from "react";
import { ArrangementInterface, ArrangementKeyInterface, SongDetailInterface } from "../../../helpers";
import { ApiHelper, ArrayHelper, DisplayBox, LinkInterface, Locale, SmallButton } from "@churchapps/apphelper";
import { Alert, Box, Button, Icon, Menu, MenuItem, Tab, Tabs } from "@mui/material";
import { PraiseChartsProducts } from "./PraiseChartsProducts";
import { KeyEdit } from "./KeyEdit";
import { PraiseChartsHelper } from "../../../helpers/PraiseChartsHelper";
import { LinkEdit } from "./LinkEdit";

interface Props {
  arrangement: ArrangementInterface;
  songDetail: SongDetailInterface;
  importLyrics: () => void;
}

export const Keys = (props: Props) => {
  const [keys, setKeys] = React.useState<ArrangementKeyInterface[]>([])
  const [selectedKey, setSelectedKey] = React.useState<ArrangementKeyInterface>(null);
  const [editKey, setEditKey] = React.useState<ArrangementKeyInterface>(null);
  const [editLink, setEditLink] = React.useState<LinkInterface>(null);
  const [products, setProducts] = React.useState<any[]>([]);
  const [links, setLinks] = React.useState<LinkInterface[]>([]);
  const [showImport, setShowImport] = React.useState(false);
  const [canImportLyrics, setCanImportLyrics] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === "add") setEditKey({ arrangementId: props.arrangement.id, keySignature: "C", shortDescription: "Default" });
    else {
      const k = ArrayHelper.getOne(keys, "id", newValue);
      setSelectedKey(k);
      setEditKey(null);
    }
  };

  const loadData = async () => {
    if (props.arrangement) {
      const keys = await ApiHelper.get("/arrangementKeys/arrangement/" + props.arrangement.id, "ContentApi");
      setKeys(keys);
      if (keys.length > 0) setSelectedKey(keys[0]);
    }
  }

  const loadPraiseCharts = async () => {
    if (selectedKey && props.songDetail?.praiseChartsId) {
      const data = await ApiHelper.get("/praiseCharts/arrangement/raw/" + props.songDetail.praiseChartsId + "?keys=" + selectedKey.keySignature, "ContentApi");
      const products = data[selectedKey.keySignature];
      if (!props.arrangement?.lyrics && products.length > 0) setCanImportLyrics(true);
      if (products) setProducts(products);
      else setProducts([]);
    }
  }

  const loadLinks = () => {
    if (selectedKey) ApiHelper.get("/links?category=arrangementKey_" + selectedKey.id, "ContentApi").then(data => { setLinks(data); });
  }

  useEffect(() => { loadData() }, [props.arrangement]) //eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { loadPraiseCharts(); loadLinks(); }, [selectedKey, props.songDetail]) //eslint-disable-line react-hooks/exhaustive-deps

  //<DisplayBox headerText="Keys" headerIcon="music_note">
  //<PraiseChartsProducts praiseChartsId={songDetail?.praiseChartsId} />

  const download = async (product: any) => {
    const qs = product.download.split("?")[1].split("&");
    const skus = qs[0].split("=")[1];
    const keys = qs[1].split("=")[1];
    PraiseChartsHelper.download(skus, product.name + "." + product.file_type, keys)
  }

  const listProducts = () => (<ul>
    {products.map((p, i) => (<li key={i}>
      <a href="about:blank" onClick={(e) => { e.preventDefault(); download(p); }}>
        {p.name}
      </a>
    </li>))}
  </ul>)

  const listLinks = () => (<ul>
    {links.map((l, i) => (<li key={l.id}>
      <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditLink(l); }}><Icon>edit</Icon></a>
      <a href={l.url} target="_blank" rel="noreferrer">{l.text}</a>
    </li>))}
  </ul>)




  if (editKey) return <KeyEdit arrangementKey={editKey} onSave={(k) => { setEditKey(null); loadData(); }} onCancel={() => setEditKey(null)} />
  return (<>
    <DisplayBox headerText="Keys" headerIcon="music_note" editFunction={(selectedKey) ? () => { setEditKey(selectedKey) } : null}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedKey?.id || ""} onChange={handleTabChange} aria-label="basic tabs example">
          {keys.map((k, i) => <Tab key={k.id} value={k.id} label={k.shortDescription + " (" + k.keySignature + ")"} />)}
          <Tab value="add" label="+ Add" />
        </Tabs>
      </Box>
      {canImportLyrics && <Alert style={{ marginTop: 10 }} icon={<Button onClick={() => { props.importLyrics(); setShowImport(false); }} variant="contained" color="success">Import</Button>} severity="success">Would you like to import the text lyrics from PraiseCharts?</Alert>}
      {listProducts()}
      {listLinks()}

      {selectedKey && <Button id="addBtnGroup" variant="contained" size="small" color="success" onClick={handleClick} sx={{ mt: 2 }}>
        <Icon sx={{ mr: "3px" }}>add</Icon> Add Files
      </Button>
      }
      <Menu id="add-menu" MenuListProps={{ "aria-labelledby": "addBtnGroup" }} anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem data-cy="add-campus" onClick={() => { handleClose(); setShowImport(true); }}>
          <Icon sx={{ mr: "3px" }}>cloud_download</Icon> Import files from PraiseCharts
        </MenuItem>
        <MenuItem data-cy="add-campus" onClick={() => { handleClose(); setEditLink({ category: "arrangementKey_" + selectedKey.id, linkType: "url", sort: 1, linkData: "", icon: "" }) }}>
          <Icon sx={{ mr: "3px" }}>link</Icon> Add external link
        </MenuItem>
      </Menu>

    </DisplayBox>
    {editLink && <LinkEdit link={editLink} onSave={(l) => { setEditLink(null); loadLinks(); }} onCancel={() => setEditLink(null)} />}

    {showImport && <PraiseChartsProducts praiseChartsId={props.songDetail?.praiseChartsId} keySignature={selectedKey?.keySignature || ""} onHide={() => { setShowImport(false); loadPraiseCharts(); }} />}

  </>)
}

