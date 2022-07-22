import React from "react";
import { Grid, Typography } from "@mui/material";
import { ApiHelper, ArrayHelper, DateHelper, DisplayBox, GroupMemberInterface, TaskInterface, UserHelper } from "../components";
import { SmallButton } from "../../appBase/components";
import { Link } from "react-router-dom";
import { NewTask } from "./";
import UserContext from "../../UserContext";
import useMountedState from "../../appBase/hooks/useMountedState";

interface Props { compact?: boolean; status: string }

export const TaskList = (props: Props) => {
  const [showAdd, setShowAdd] = React.useState(false);
  const [tasks, setTasks] = React.useState<TaskInterface[]>([])
  const [groupTasks, setGroupTasks] = React.useState<TaskInterface[]>([])
  const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([])
  const isMounted = useMountedState()
  let context = React.useContext(UserContext)

  const editContent = <SmallButton icon="add" onClick={() => { setShowAdd(true) }} />

  const loadData = () => {
    if (props.status === "Closed") ApiHelper.get("/tasks/closed", "DoingApi").then(data => {
      if(isMounted()) {
        setTasks(data);
      }
    });
    else ApiHelper.get("/tasks", "DoingApi").then(data => {
      if(isMounted()) {
        setTasks(data);
      }
    });
    if (UserHelper.person?.id) ApiHelper.get("/groupmembers?personId=" + UserHelper.person?.id, "MembershipApi").then(data => {
      if(isMounted()) {
        setGroupMembers(data);
      }
    });
  }

  const loadGroupTasks = () => {
    if (groupMembers?.length > 0) {
      const groupIds = ArrayHelper.getIds(groupMembers, "groupId");
      ApiHelper.post("/tasks/loadForGroups", { groupIds, status: props.status }, "DoingApi").then(d => {
        if(isMounted()) {
          setGroupTasks(d);
        }
      });
    }
  }

  React.useEffect(loadData, [props.status, isMounted]);
  React.useEffect(loadGroupTasks, [groupMembers, props.status, isMounted]);

  const getTask = (task: TaskInterface) => (<div key={task.id} style={{ borderTop: "1px solid #CCC", paddingTop: 10, paddingBottom: 10 }}>
    <Grid container spacing={3}>
      <Grid item xs={(props.compact) ? 12 : 6}>
        <b><Link to={"/tasks/" + task.id}>{task.title}</Link></b><br />
        <Typography variant="caption">#{task.taskNumber} opened {DateHelper.getDisplayDuration(DateHelper.convertToDate(task.dateCreated))} ago by {task.createdByLabel}</Typography>
      </Grid>
      {!props.compact && (<>
        <Grid item xs={3}>
          {task.associatedWithLabel}
        </Grid>
        <Grid item xs={3}>
          {task.assignedToLabel}
        </Grid>
      </>)}
    </Grid>
  </div>)

  const getHeader = () => {
    if (props.compact) return <></>;
    else return (<div style={{ paddingBottom: 10 }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          Title
        </Grid>
        <Grid item xs={3}>Associated with</Grid>
        <Grid item xs={3}>Assigned to</Grid>
      </Grid>
    </div>)
  }

  const getAssignedToMyGroups = () => {
    if (groupMembers?.length > 0) {
      const groupIds = ArrayHelper.getIds(groupMembers, "groupId");
      const assignedToMyGroups = (groupTasks?.length > 0) ? ArrayHelper.getAllArray(groupTasks, "assignedToId", groupIds) : []
      if (assignedToMyGroups.length === 0) return <></>
      else return (<>
        <h4>Assigned to My Groups</h4>
        {getHeader()}
        {assignedToMyGroups.map(t => getTask(t))}
      </>);
    }
  }

  const getAssignedToMe = () => {
    const assignedToMe = (tasks?.length > 0) ? ArrayHelper.getAll(tasks, "assignedToId", context.person?.id) : []
    if (assignedToMe.length === 0) return <></>
    else return (<>
      <h4>Assigned to Me</h4>
      {getHeader()}
      {assignedToMe.map(t => getTask(t))}
    </>);
  }

  const createdByMe = () => {
    const createdByMe = (tasks?.length > 0) ? ArrayHelper.getAll(tasks, "createdById", context.person?.id) : []
    if (createdByMe.length === 0) return <></>
    else return (<>
      <h4>Requested by Me</h4>
      {getHeader()}
      {createdByMe.map(t => getTask(t))}
    </>);
  }

  return (<>
    {showAdd && <NewTask compact={props.compact} onCancel={() => { setShowAdd(false); }} onSave={() => { loadData(); setShowAdd(false); }} />}
    <DisplayBox headerIcon="list_alt" headerText="Tasks" editContent={editContent}>
      {getAssignedToMe()}
      {getAssignedToMyGroups()}
      {createdByMe()}
    </DisplayBox>
  </>);
}
