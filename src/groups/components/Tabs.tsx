import React, { useCallback } from "react";
import { UserHelper, GroupInterface, GroupMembers, GroupSessions, SessionInterface, PersonInterface, Permissions } from ".";

interface Props {
    group: GroupInterface
    addedPerson?: PersonInterface,
    addedSession?: SessionInterface,
    addedCallback: () => void,
    sidebarVisibilityFunction: (name: string, visible: boolean) => void
}

export const Tabs: React.FC<Props> = (props) => {
    const [selectedTab, setSelectedTab] = React.useState("");

    const getTab = (keyName: string, icon: string, text: string, dataCy?: string) => {
        var className = (keyName === selectedTab) ? "nav-link active" : "nav-link";
        return <li className="nav-item" key={keyName}><a href="about:blank" data-cy={dataCy} onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
    }

    const setVisibilityState = useCallback(() => {
        if (selectedTab === "members" && UserHelper.checkAccess(Permissions.membershipApi.groupMembers.edit)) props.sidebarVisibilityFunction("addPerson", true);
        if (selectedTab === "sessions" && UserHelper.checkAccess(Permissions.attendanceApi.attendance.edit)) {
            props.sidebarVisibilityFunction("addPerson", true);
            props.sidebarVisibilityFunction("addMember", true);
        }
    }, [props, selectedTab,]
    )
    const getCurrentTab = () => {

        var currentTab = null;
        switch (selectedTab) {
            case "members": currentTab = <GroupMembers group={props.group} addedPerson={props.addedPerson} addedCallback={props.addedCallback} />; break;
            case "sessions": currentTab = <GroupSessions group={props.group} sidebarVisibilityFunction={props.sidebarVisibilityFunction} addedSession={props.addedSession} addedPerson={props.addedPerson} addedCallback={props.addedCallback} />; break;
            default: currentTab = <div>Not implemented</div>; break;
        }
        return currentTab
    }


    const getTabs = () => {
        if (props.group === null || props.group.id === undefined) return null;
        var tabs = [];
        var defaultTab = ""

        if (UserHelper.checkAccess(Permissions.membershipApi.groupMembers.view)) { tabs.push(getTab("members", "fas fa-users", "Members")); defaultTab = "members"; }
        if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view) && props.group?.trackAttendance) { tabs.push(getTab("sessions", "far fa-calendar-alt", "Sessions", "sessions-tab")); if (defaultTab === "") defaultTab = "sessions"; }
        if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);
        return tabs;
    }

    React.useEffect(() => {
        setVisibilityState()

    }, [selectedTab, setVisibilityState,]);




    return (<><ul className="nav nav-tabs" id="groupTabs" data-cy="group-tabs" >{getTabs()}</ul>{getCurrentTab()}</>);
}