import React, { useEffect, memo, useCallback, useMemo } from "react";
import { ApiHelper, ArrayHelper } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { type ArrangementInterface, type ArrangementKeyInterface, type SongDetailInterface, type SongInterface } from "../../helpers";
import { 
  Grid, 
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Paper
} from "@mui/material";
import {
  LibraryMusic as MusicIcon,
  Add as AddIcon,
  QueueMusic as ArrangementIcon
} from "@mui/icons-material";
import { Arrangement } from "./components/Arrangement";
import { SongSearchDialog } from "./SongSearchDialog";

export const SongPage = memo(() => {
  const [song, setSong] = React.useState<SongInterface>(null)
  const [showSearch, setShowSearch] = React.useState(false)
  const [arrangements, setArrangements] = React.useState<ArrangementInterface[]>([]);
  const [selectedArrangement, setSelectedArrangement] = React.useState(null);
  const params = useParams();

  const loadData = useCallback(async () => {
    if (!params.id) return;
    const s = await ApiHelper.get("/songs/" + params.id, "ContentApi");
    setSong(s);
    const arrangements = await ApiHelper.get("/arrangements/song/" + s.id, "ContentApi");
    setArrangements(arrangements);
    if (arrangements.length > 0) setSelectedArrangement(arrangements[0]);
  }, [params.id]);

  useEffect(() => { loadData() }, [loadData])



  const selectArrangement = useCallback((arrangementId: string) => {
    const arr = ArrayHelper.getOne(arrangements, "id", arrangementId);
    setSelectedArrangement(arr);
  }, [arrangements]);

  const handleAdd = useCallback(async (songDetail: SongDetailInterface) => {
    if (!song?.id) return;
    const a: ArrangementInterface = { songId: song.id, songDetailId: songDetail.id, name: songDetail.artist, lyrics: "" };
    await ApiHelper.post("/arrangements", [a], "ContentApi");
    if (songDetail.keySignature) {
      const key: ArrangementKeyInterface = { arrangementId: a.id, keySignature: songDetail.keySignature, shortDescription: "Default" };
      await ApiHelper.post("/arrangementKeys", [key], "ContentApi");
    }
    loadData();
    setShowSearch(false);
  }, [song?.id, loadData]);

  const arrangementNavigation = useMemo(() => (
    <Card sx={{ height: 'fit-content', borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <MusicIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Arrangements
          </Typography>
        </Stack>
        
        <List sx={{ p: 0 }}>
          {arrangements.map((arrangement, index) => (
            <Box key={arrangement.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemButton
                  selected={selectedArrangement?.id === arrangement.id}
                  onClick={() => selectArrangement(arrangement.id)}
                  sx={{
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ArrangementIcon 
                      sx={{ 
                        color: selectedArrangement?.id === arrangement.id ? 'primary.main' : 'text.secondary'
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={arrangement.name}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: selectedArrangement?.id === arrangement.id ? 600 : 400,
                        color: selectedArrangement?.id === arrangement.id ? 'primary.main' : 'text.primary'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {index < arrangements.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </Box>
          ))}
        </List>
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setShowSearch(true)}
          fullWidth
          sx={{ 
            mt: 2,
            borderStyle: 'dashed',
            color: 'text.secondary',
            borderColor: 'grey.400',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              backgroundColor: 'primary.light'
            }
          }}
        >
          Add Arrangement
        </Button>
      </CardContent>
    </Card>
  ), [arrangements, selectedArrangement, selectArrangement]);

  const currentContent = useMemo(() => {
    if (!selectedArrangement) {
      return (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            backgroundColor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <ArrangementIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Arrangement Selected
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select an arrangement from the sidebar to get started.
          </Typography>
        </Paper>
      );
    }
    
    return <Arrangement arrangement={selectedArrangement} reload={loadData} />;
  }, [selectedArrangement, loadData]);


  return (
    <>
      <Banner>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#FFF' }}>
          {song?.name || "Loading..."}
        </Typography>
      </Banner>
      
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            {arrangementNavigation}
          </Grid>
          
          <Grid size={{ xs: 12, md: 9 }}>
            {currentContent}
          </Grid>
        </Grid>
      </Box>
      
      {showSearch && (
        <SongSearchDialog 
          searchText={song?.name} 
          onClose={() => setShowSearch(false)} 
          onSelect={handleAdd} 
        />
      )}
    </>
  );
});

