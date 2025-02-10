import React from "react";
import { ApiHelper, DisplayBox, SmallButton } from "@churchapps/apphelper";

import { Accordion, AccordionDetails, AccordionSummary, Icon, IconButton, Stack, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { ArrangementInterface, SongInterface } from "../../../helpers";
import { ArrangementEdit } from "./ArrangementEdit";
import { Arrangement } from "./Arrangement";


interface Props {
  song: SongInterface;
  reload: () => void;
}

export const Arrangements = (props: Props) => {

  const [arrangements, setArrangements] = React.useState<any[]>([]);
  const [editArrangement, setEditArrangement] = React.useState<any>(null);

  const loadData = () => {
    ApiHelper.get("/arrangements/song/" + props.song.id, "ContentApi").then(data => setArrangements(data));
  }

  React.useEffect(() => { if (props.song) loadData() }, [props.song?.id]);

  const getArrangements = () => {
    const result:JSX.Element[] = [];
    if (!arrangements) return result;
    else if (arrangements.length === 0) result.push(<p>No arrangements found.</p>);
    else if (arrangements.length === 1) result.push(<Arrangement arrangement={arrangements[0]} originalKey="C" />);
    else {
      const accordions:JSX.Element[] = [];
      arrangements.forEach((arrangement: any) => {
        result.push(<Accordion key={arrangement.id}>
          <AccordionSummary>
            {arrangement.name}
            <span style={{marginLeft:"auto"}}><SmallButton onClick={() => { setEditArrangement(arrangement) }} icon="edit" /></span>
          </AccordionSummary>
          <AccordionDetails>
            <Arrangement arrangement={arrangement} originalKey="C" />
          </AccordionDetails>
        </Accordion>);
      });
      //result.push(<p>{arrangements.length} arrangements found.</p>);
    }
    return result;
  }

  const getEditContent = () => (
    <Stack direction="row">
      <SmallButton onClick={() => { setEditArrangement({name:"Default", songId: props.song?.id }); }} icon="add" />
      {arrangements?.length===1 && <SmallButton onClick={() => { setEditArrangement(arrangements[0]) }} icon="edit" />}
    </Stack>
  );

  const handleSave = (arrangement: ArrangementInterface) => {
    loadData();
    setEditArrangement(null);
  }


  if (editArrangement) return (<ArrangementEdit arrangement={editArrangement} onSave={handleSave} onCancel={() => {setEditArrangement(null)}} />)
  else return (<DisplayBox headerText="Arrangements" headerIcon="library_music" editContent={getEditContent()}>
    {getArrangements()}
  </DisplayBox>);
}

