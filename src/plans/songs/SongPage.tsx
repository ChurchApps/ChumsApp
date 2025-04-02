import React, { useEffect } from "react";
import { ApiHelper, ArrayHelper, DateHelper, DisplayBox, Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { Link, useParams } from "react-router-dom";
import { ArrangementInterface, SongDetailInterface, SongInterface } from "../../helpers";
import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, Icon } from "@mui/material";
import { Arrangement } from "./components/Arrangement";

export const SongPage = () => {
  const [song, setSong] = React.useState<SongInterface>(null)
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

  useEffect(() => { loadData() }, []) //eslint-disable-line react-hooks/exhaustive-deps


  let defaultTab = "details";

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
    if (selectedArrangement) currentTab = <Arrangement arrangement={selectedArrangement} />;
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

  /*
  <Grid container spacing={3}>
            <Grid item md={8}>
              <Arrangements song={song} reload={loadData} songDetail={songDetail} />
              <DisplayBox headerText="Keys" headerIcon="music_note">
                <PraiseChartsProducts praiseChartsId={songDetail?.praiseChartsId} />
              </DisplayBox>
            </Grid>
            <Grid item md={4}>
              <SongDetails songDetail={songDetail} reload={loadData} />
            </Grid>
          </Grid>
*/


  return (<>
    <Banner>
      <h1>{song?.title}</h1>
    </Banner>
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <div className="sideNav" style={{ height: "100vh", borderRight: "1px solid #CCC" }}>
          <ul>
            {getTabs().map((tab, index) => getItem(tab))}
            <li><a href="about:blank" onClick={(e) => { e.preventDefault(); }}><Icon>add</Icon> Add Arrangement</a></li>
          </ul>
        </div>
      </Grid>
      <Grid item xs={12} md={10}>


        <div id="mainContent">
          {getCurrentTab()}

        </div>
      </Grid>
    </Grid>
  </>);
}

