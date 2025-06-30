import React, { useEffect } from "react";
import { ApiHelper, ArrayHelper } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { type ArrangementInterface, type ArrangementKeyInterface, type SongDetailInterface, type SongInterface } from "../../helpers";
import { Grid, Icon } from "@mui/material";
import { Arrangement } from "./components/Arrangement";
import { SongSearchDialog } from "./SongSearchDialog";

export const SongPage = () => {
  const [song, setSong] = React.useState<SongInterface>(null)
  const [showSearch, setShowSearch] = React.useState(false)
  const [arrangements, setArrangements] = React.useState<ArrangementInterface[]>([]);
  const [selectedArrangement, setSelectedArrangement] = React.useState(null);
  const params = useParams();

  const loadData = async () => {
    const s = await ApiHelper.get("/songs/" + params.id, "ContentApi");
    setSong(s);
    const arrangements = await ApiHelper.get("/arrangements/song/" + s.id, "ContentApi");
    setArrangements(arrangements);
    if (arrangements.length > 0) setSelectedArrangement(arrangements[0]);
  }

  useEffect(() => { loadData() }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps



  const getTabs = () => {
    const tabs: { key: string, icon: string, label: string }[] = [];
    arrangements.forEach((arrangement) => {
      tabs.push({ key: arrangement.id, icon: "library_music", label: arrangement.name });
    });
    //tabs.push({ key: "details", icon: "library_music", label: "Default Arrangement" });
    //if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);
    return tabs;
  }

  const getCurrentTab = () => {
    let currentTab = null;
    if (selectedArrangement) currentTab = <Arrangement arrangement={selectedArrangement} reload={loadData} />;
    return currentTab;
  }

  const selectTab = (key: string) => {
    const arr = ArrayHelper.getOne(arrangements, "id", key);
    setSelectedArrangement(arr);
  }

  const getItem = (tab: any) => {
    if (tab.key === selectedArrangement?.id) return (<li className="active"><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedArrangement(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
    return (<li><a href="about:blank" onClick={(e) => { e.preventDefault(); selectTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
  }


  const handleAdd = async (songDetail: SongDetailInterface) => {
    const a: ArrangementInterface = { songId: song.id, songDetailId: songDetail.id, name: songDetail.artist, lyrics: "" };
    await ApiHelper.post("/arrangements", [a], "ContentApi");
    if (songDetail.keySignature) {
      const key: ArrangementKeyInterface = { arrangementId: a.id, keySignature: songDetail.keySignature, shortDescription: "Default" };
      await ApiHelper.post("/arrangementKeys", [key], "ContentApi");
    }
    loadData();
    setShowSearch(false);
  }


  return (<>
    <Banner>
      <h1>{song?.name}</h1>
    </Banner>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 2 }}>
        <div className="sideNav" style={{ height: "100vh", borderRight: "1px solid #CCC" }}>
          <ul>
            {getTabs().map((tab) => getItem(tab))}
            <li><a href="about:blank" onClick={(e) => { e.preventDefault(); setShowSearch(true); }}><Icon>add</Icon> Add Arrangement</a></li>
          </ul>
        </div>
      </Grid>
      <Grid size={{ xs: 12, md: 10 }}>


        <div id="mainContent">
          {getCurrentTab()}

        </div>
      </Grid>
    </Grid>
    {showSearch && <SongSearchDialog searchText={song.name} onClose={() => setShowSearch(false)} onSelect={handleAdd} />}
  </>);
}

