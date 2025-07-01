import React, { memo, useCallback, useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import { ApiHelper, ArrayHelper, DateHelper, DisplayBox, type GroupMemberInterface, Locale, type TaskInterface, UserHelper } from "@churchapps/apphelper";
import { SmallButton } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { NewTask } from "./";
import UserContext from "../../UserContext";
import { useMountedState } from "@churchapps/apphelper";

interface Props { compact?: boolean; status: string }

export const TaskList = memo((props: Props) => {
  const [showAdd, setShowAdd] = React.useState(false);
  const [tasks, setTasks] = React.useState<TaskInterface[]>([])
  const [groupTasks, setGroupTasks] = React.useState<TaskInterface[]>([])
  const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([])
  const isMounted = useMountedState()
  const context = React.useContext(UserContext)

  const editContent = <SmallButton icon="add" onClick={() => { setShowAdd(true) }} data-testid="add-task-button" ariaLabel="Add task" />

  const loadData = useCallback(() => {
    if (props.status === Locale.label("tasks.taskPage.closed")) ApiHelper.get("/tasks/closed", "DoingApi").then(data => {
      if (isMounted()) {
        setTasks(data);
      }
    });
    else ApiHelper.get("/tasks", "DoingApi").then(data => {
      if (isMounted()) {
        setTasks(data);
      }
    });
    if (UserHelper.person?.id) ApiHelper.get("/groupmembers?personId=" + UserHelper.person?.id, "MembershipApi").then(data => {
      if (isMounted()) {
        setGroupMembers(data);
      }
    });
  }, [props.status, isMounted]);

  const loadGroupTasks = useCallback(() => {
    if (groupMembers?.length > 0) {
      const groupIds = ArrayHelper.getIds(groupMembers, "groupId");
      ApiHelper.post("/tasks/loadForGroups", { groupIds, status: props.status }, "DoingApi").then(d => {
        if (isMounted()) {
          setGroupTasks(d);
        }
      });
    }
  }, [groupMembers, props.status, isMounted]);

  React.useEffect(loadData, [props.status, isMounted, loadData]);
  React.useEffect(loadGroupTasks, [groupMembers, props.status, isMounted, loadGroupTasks]);

  const getTask = useCallback((task: TaskInterface) => (<div key={task.id} style={{ borderTop: "1px solid #CCC", paddingTop: 10, paddingBottom: 10 }}>
    <Grid container spacing={3}>
      <Grid size={{ xs: (props.compact) ? 12 : 6 }}>
        <b><Link to={"/tasks/" + task.id}>{task.title}</Link></b><br />
        <Typography variant="caption">#{task.taskNumber} {Locale.label("tasks.taskPage.opened")} {DateHelper.getDisplayDuration(DateHelper.toDate(task.dateCreated))} {Locale.label("tasks.taskPage.ago")} {Locale.label("tasks.taskPage.by")} {task.createdByLabel}</Typography>
      </Grid>
      {!props.compact && (<>
        <Grid size={{ xs: 3 }}>
          {task.associatedWithLabel}
        </Grid>
        <Grid size={{ xs: 3 }}>
          {task.assignedToLabel}
        </Grid>
      </>)}
    </Grid>
  </div>), [props.compact]);

  const getHeader = () => {
    if (props.compact) return <></>;
    else return (<div style={{ paddingBottom: 10 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 6 }}>
          {Locale.label("common.title")}
        </Grid>
        <Grid size={{ xs: 3 }}>{Locale.label("tasks.taskList.associateW")}</Grid>
        <Grid size={{ xs: 3 }}>{Locale.label("tasks.taskList.assignTo")}</Grid>
      </Grid>
    </div>)
  }

  const assignedToMyGroups = useMemo(() => {
    if (groupMembers?.length > 0) {
      const groupIds = ArrayHelper.getIds(groupMembers, "groupId");
      return (groupTasks?.length > 0) ? ArrayHelper.getAllArray(groupTasks, "assignedToId", groupIds) : []
    }
    return [];
  }, [groupMembers, groupTasks]);

  const assignedToMe = useMemo(() => {
    return (tasks?.length > 0) ? ArrayHelper.getAll(tasks, "assignedToId", context.person?.id) : []
  }, [tasks, context.person?.id]);

  const createdByMe = useMemo(() => {
    return (tasks?.length > 0) ? ArrayHelper.getAll(tasks, "createdById", context.person?.id) : []
  }, [tasks, context.person?.id]);

  const getAssignedToMyGroups = () => {
    if (assignedToMyGroups.length === 0) return <></>
    else return (<>
      <h4>{Locale.label("tasks.taskList.assignGroup")}</h4>
      {getHeader()}
      {assignedToMyGroups.map(t => getTask(t))}
    </>);
  }

  const getAssignedToMe = () => {
    if (assignedToMe.length === 0) return <></>
    else return (<>
      <h4>{Locale.label("tasks.taskList.assignMe")}</h4>
      {getHeader()}
      {assignedToMe.map(t => getTask(t))}
    </>);
  }

  const getCreatedByMe = () => {
    if (createdByMe.length === 0) return <></>
    else return (<>
      <h4>{Locale.label("tasks.taskList.reqMe")}</h4>
      {getHeader()}
      {createdByMe.map(t => getTask(t))}
    </>);
  }

  return (<>
    {showAdd && <NewTask compact={props.compact} onCancel={() => { setShowAdd(false); }} onSave={() => { loadData(); setShowAdd(false); }} />}
    <DisplayBox headerIcon="list_alt" headerText={Locale.label("tasks.taskList.tasks")} editContent={editContent} help="chums/tasks">
      {getAssignedToMe()}
      {getAssignedToMyGroups()}
      {getCreatedByMe()}
    </DisplayBox>
  </>);
});
