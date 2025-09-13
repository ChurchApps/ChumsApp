import React, { memo, useCallback, useMemo } from "react";
import { ChumsPersonHelper } from ".";
import { type GroupMemberInterface, type SearchCondition } from "@churchapps/helpers";
import { ArrayHelper, InputBox, ApiHelper, Locale } from "@churchapps/apphelper";
import { type PersonInterface, type FundDonationInterface } from "@churchapps/helpers";
import { EditCondition } from "./EditCondition";
import { Button, Icon, Box } from "@mui/material";

interface Props {
  updateSearchResults: (people: PersonInterface[]) => void;
  toggleFunction: () => void;
}

export const AdvancedPeopleSearch = memo(function AdvancedPeopleSearch(props: Props) {
  const [conditions, setConditions] = React.useState<SearchCondition[]>([]);
  const [showAddCondition, setShowAddCondition] = React.useState(true);

  const convertConditions = useCallback(async () => {
    const result: SearchCondition[] = [];
    for (const c of conditions) {
      switch (c.field) {
        case "groupMember":
          const val = JSON.parse(c.value);
          const members: GroupMemberInterface[] = await ApiHelper.get("/groupmembers?groupId=" + val.value, "MembershipApi");
          const peopleIds = ArrayHelper.getIds(members, "personId");
          result.push({ field: "id", operator: c.operator, value: peopleIds.join(",") });
          break;
        case "memberDonations":
          const fundVal = JSON.parse(c.value);
          let memberDonations: FundDonationInterface[];
          if (c.operator === "donatedToAny") {
            memberDonations = await ApiHelper.get(`/funddonations?startDate=${fundVal[1].from}&endDate=${fundVal[1].to}`, "GivingApi");
          } else {
            memberDonations = await ApiHelper.get(`/funddonations?fundId=${fundVal[0].value}&startDate=${fundVal[1].from}&endDate=${fundVal[1].to}`, "GivingApi");
          }
          const memberIds = ArrayHelper.getUniqueValues(memberDonations, "donation.personId").filter((f) => f !== null);
          result.push({ field: "id", operator: c.operator, value: memberIds.join(",") });
          break;
        case "memberAttendance":
          const attendanceValue = JSON.parse(c.value);
          let attendees;
          const dateParams = `startDate=${attendanceValue[1].from}&endDate=${attendanceValue[1].to}`;
          if (c.operator === "attendedCampus") {
            attendees = await ApiHelper.get(`/attendancerecords/search?campusId=${attendanceValue[0].value}&${dateParams}`, "AttendanceApi");
          } else if (c.operator === "attendedService") {
            attendees = await ApiHelper.get(`/attendancerecords/search?serviceId=${attendanceValue[0].value}&${dateParams}`, "AttendanceApi");
          } else if (c.operator === "attendedServiceTime") {
            attendees = await ApiHelper.get(`/attendancerecords/search?serviceTimeId=${attendanceValue[0].value}&${dateParams}`, "AttendanceApi");
          } else if (c.operator === "attendedGroup") {
            attendees = await ApiHelper.get(`/attendancerecords/search?groupId=${attendanceValue[0].value}&${dateParams}`, "AttendanceApi");
          } else {
            attendees = await ApiHelper.get(`/attendancerecords/search?${dateParams}`, "AttendanceApi");
          }
          const attendeeIds = ArrayHelper.getIds(attendees, "personId");
          result.push({ field: "id", operator: c.operator, value: attendeeIds.join(",") });
          break;
        default:
          result.push(c);
          break;
      }
    }
    return result;
  }, [conditions]);

  const handleAdvancedSearch = useCallback(async () => {
    const postConditions = await convertConditions();
    ApiHelper.post("/people/advancedSearch", postConditions, "MembershipApi").then((data) => {
      props.updateSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)));
    });
  }, [convertConditions, props]);

  const conditionAddedHandler = useCallback(
    (condition: SearchCondition) => {
      const c = [...conditions];
      c.push(condition);
      setConditions(c);
      setShowAddCondition(false);
    },
    [conditions]
  );

  const showAddConditionHandler = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowAddCondition(true);
  }, []);

  const addConditionContent = useMemo(() => {
    if (showAddCondition) return <EditCondition conditionAdded={conditionAddedHandler} />;
    else {
      return (
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            justifyContent: "flex-end",
            background: "none",
            border: 0,
            padding: 0,
            color: "#1976d2",
            cursor: "pointer",
          }}
          onClick={showAddConditionHandler}>
          <Icon>add</Icon> {Locale.label("people.peopleSearch.addCon")}
        </button>
      );
    }
  }, [showAddCondition, conditionAddedHandler, showAddConditionHandler]);

  const removeCondition = useCallback(
    (index: number) => {
      const c = [...conditions];
      c.splice(index, 1);
      setConditions(c);
    },
    [conditions]
  );

  const displayConditions = useMemo(() => {
    const result: JSX.Element[] = [];
    let idx = 0;
    for (const c of conditions) {
      const displayField = c.field
        .split(/(?=[A-Z])/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const displayOperator = c.operator
        .replace("lessThanEqual", "<=")
        .replace("greaterThan", ">")
        .replace("equals", "=")
        .replace("lessThan", "<")
        .replace("greaterThanEqual", ">=")
        .replace("notIn", Locale.label("people.peopleSearch.notIn"))
        .replace("donatedToAny", Locale.label("people.peopleSearch.madeTo"))
        .replace("donatedTo", Locale.label("people.peopleSearch.madeTo"))
        .replace("attendedCampus", Locale.label("people.peopleSearch.for"))
        .replace("attendedAny", Locale.label("people.peopleSearch.for"))
        .replace("attendedServiceTime", Locale.label("people.peopleSearch.for"))
        .replace("attendedService", Locale.label("people.peopleSearch.for"))
        .replace("attendedGroup", Locale.label("people.peopleSearch.for"));
      const index = idx;
      let displayValue = c.value.indexOf('"value":') > -1 ? JSON.parse(c.value).text : c.value;
      if (c.field === "memberAttendance" || c.field === "memberDonations") {
        const parsedValue = JSON.parse(c.value);
        displayValue = `${parsedValue[0]?.text} [${parsedValue[1]?.from} - ${parsedValue[1]?.to}]`;
      }
      result.push(
        <Box key={index} sx={{ display: "flex", alignItems: "center" }} mb={1}>
          <button
            type="button"
            style={{ display: "flex", background: "none", border: 0, padding: 0, color: "#dc3545", cursor: "pointer" }}
            onClick={() => removeCondition(index)}>
            <Icon sx={{ marginRight: "5px" }}>delete</Icon>
          </button>
          <Box>
            <b>{displayField}</b> {displayOperator} <i>{displayValue}</i>
          </Box>
        </Box>
      );
      idx++;
    }
    return result;
  }, [conditions, removeCondition]);

  return (
    <InputBox
      id="advancedSearch"
      headerIcon="person"
      headerText={Locale.label("people.peopleSearch.advSearch")}
      headerActionContent={
        <Button onClick={props.toggleFunction} sx={{ textTransform: "none" }}>
          {Locale.label("people.peopleSearch.simp")}
        </Button>
      }
      saveFunction={handleAdvancedSearch}
      saveText="Search"
      isSubmitting={conditions.length < 1}
      help="chums/advanced-search">
      <p>{Locale.label("people.peopleSearch.allPeeps")}</p>
      {displayConditions}
      {addConditionContent}
    </InputBox>
  );
});
