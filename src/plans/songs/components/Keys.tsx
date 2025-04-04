import React, { useEffect } from "react";
import { ArrangementInterface, ArrangementKeyInterface, SongDetailInterface } from "../../../helpers";
import { ApiHelper, ArrayHelper, DisplayBox } from "@churchapps/apphelper";
import { Alert, Box, Button, Icon, Tab, Tabs } from "@mui/material";
import { PraiseChartsProducts } from "./PraiseChartsProducts";
import { KeyEdit } from "./KeyEdit";
import { PraiseChartsHelper } from "../../../helpers/PraiseChartsHelper";

interface Props {
  arrangement: ArrangementInterface;
  songDetail: SongDetailInterface;
  importLyrics: () => void;
}

export const Keys = (props: Props) => {
  const [keys, setKeys] = React.useState<ArrangementKeyInterface[]>([])
  const [selectedKey, setSelectedKey] = React.useState<ArrangementKeyInterface>(null);
  const [editKey, setEditKey] = React.useState<ArrangementKeyInterface>(null);
  const [products, setProducts] = React.useState<any[]>([]);
  const [showImport, setShowImport] = React.useState(false);
  const [canImportLyrics, setCanImportLyrics] = React.useState(false);

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

  useEffect(() => { loadData() }, [props.arrangement]) //eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { loadPraiseCharts() }, [selectedKey, props.songDetail]) //eslint-disable-line react-hooks/exhaustive-deps

  //<DisplayBox headerText="Keys" headerIcon="music_note">
  //<PraiseChartsProducts praiseChartsId={songDetail?.praiseChartsId} />

  const download = async (product: any) => {
    const qs = product.download.split("?")[1].split("&");
    const skus = qs[0].split("=")[1];
    const keys = qs[1].split("=")[1];
    PraiseChartsHelper.download(skus, product.name + "." + product.file_type, keys)
  }

  const listProducts = () => {
    if (products.length === 0) return <p>No products found for this key</p>;
    console.log("Products", products);
    return (<ul>
      {products.map((p, i) => (<li key={i}>
        <a href="about:blank" onClick={(e) => { e.preventDefault(); download(p); }}>
          {p.name}
        </a>
      </li>))}

    </ul>)
  }


  if (editKey) return <KeyEdit arrangementKey={editKey} onSave={(k) => { setEditKey(null); loadData(); }} onCancel={() => setEditKey(null)} />
  return (<>
    <DisplayBox headerText="Keys" headerIcon="music_note">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedKey?.id || ""} onChange={handleTabChange} aria-label="basic tabs example">
          {keys.map((k, i) => <Tab key={k.id} value={k.id} label={k.shortDescription + " (" + k.keySignature + ")"} />)}
          <Tab value="add" label="+ Add" />
        </Tabs>
      </Box>
      {canImportLyrics && <Alert style={{ marginTop: 10 }} icon={<Button onClick={() => { props.importLyrics(); setShowImport(false); }} variant="contained" color="success">Import</Button>} severity="success">Would you like to import the text lyrics from PraiseCharts?</Alert>}
      {listProducts()}
      <a href="about:blank" onClick={(e) => { e.preventDefault(); setShowImport(true); }}><i className="material-icons">cloud_download</i> Import files from PraiseCharts</a>
    </DisplayBox>

    {showImport && <PraiseChartsProducts praiseChartsId={props.songDetail?.praiseChartsId} keySignature={selectedKey?.keySignature || ""} onHide={() => { setShowImport(false); loadPraiseCharts(); }} />}

  </>)
}

