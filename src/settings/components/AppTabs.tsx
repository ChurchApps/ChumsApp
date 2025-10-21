import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Divider,
  Icon
} from "@mui/material";
import {
  Edit as EditIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Tab as TabIcon
} from "@mui/icons-material";
import { ApiHelper } from "@churchapps/apphelper";
import type { LinkInterface } from "@churchapps/helpers";
import { CardWithHeader, EmptyState } from "../../components/ui";
import { ensureSequentialSort, moveItemDown, moveItemUp } from "../../helpers/SortHelper";

interface Props {
  onSelected?: (tab: LinkInterface) => void;
  refreshKey?: number;
}

export function AppTabs({ onSelected = () => {}, refreshKey = 0 }: Props) {
  const [tabs, setTabs] = useState<LinkInterface[]>([]);

  const loadData = () => {
    ApiHelper.get("/links?category=chumsTab", "ContentApi").then((data: any) => setTabs(data));
  };

  const saveChanges = () => {
    ApiHelper.post("/links", tabs, "ContentApi").then(loadData);
  };

  const moveUp = (idx: number) => {
    ensureSequentialSort(tabs);
    moveItemUp(tabs, idx);
    saveChanges();
  };

  const moveDown = (idx: number) => {
    ensureSequentialSort(tabs);
    moveItemDown(tabs, idx);
    saveChanges();
  };

  const handleEdit = (tab: LinkInterface) => {
    onSelected(tab);
  };

  const renderTabItem = (tab: LinkInterface, index: number) => (
    <React.Fragment key={index}>
      <ListItem sx={{ py: 2 }}>
        <ListItemIcon>
          <Box
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: '8px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <Icon sx={{ fontSize: 20 }}>{tab.icon}</Icon>
          </Box>
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {tab.text || "Untitled Tab"}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {tab.linkType === 'url' ? tab.url : `${tab.linkType} - ${tab.linkData}`}
            </Typography>
          }
        />
        <ListItemSecondaryAction>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Move up" arrow>
              <span>
                <IconButton
                  size="small"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  sx={{ color: 'text.secondary' }}
                >
                  <ArrowUpIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Move down" arrow>
              <span>
                <IconButton
                  size="small"
                  onClick={() => moveDown(index)}
                  disabled={index === tabs.length - 1}
                  sx={{ color: 'text.secondary' }}
                >
                  <ArrowDownIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Edit tab" arrow>
              <IconButton
                size="small"
                onClick={() => handleEdit(tab)}
                sx={{ color: 'primary.main' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </ListItemSecondaryAction>
      </ListItem>
      {index < tabs.length - 1 && <Divider />}
    </React.Fragment>
  );

  useEffect(loadData, []);
  useEffect(loadData, [refreshKey]);

  return (
    <CardWithHeader
      title="Navigation Tabs"
      icon={<TabIcon />}
    >
      {tabs.length === 0
        ? (
          <EmptyState
            icon={<TabIcon />}
            title="No navigation tabs"
            description="Create your first navigation tab to get started with your mobile app."
            variant="card"
          />
        )
        : (
          <List sx={{ p: 0 }}>
            {tabs.map((tab, index) => renderTabItem(tab, index))}
          </List>
        )}
    </CardWithHeader>
  );
}
