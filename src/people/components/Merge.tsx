import React from "react"
import {
  InputBox,
  Search,
  MergeModal,
  PersonInterface,
  ApiHelper,
  GroupMemberInterface,
  NoteInterface,
  VisitInterface,
  DonationInterface,
  FormSubmissionInterface,
} from "."
import { useHistory } from "react-router-dom"

interface Props {
    hideMergeBox: () => void,
    person: PersonInterface,
}

export const Merge: React.FunctionComponent<Props> = (props) => {
  const [searchResults, setSearchResults] = React.useState<PersonInterface[]>(null);
  const [showMergeModal, setShowMergeModal] = React.useState<boolean>(false);
  const [personToMerge, setPersonToMerge] = React.useState<PersonInterface>(null);
  const [mergeInProgress, setMergeInProgress] = React.useState<boolean>(false);
  const history = useHistory()

  const handleSave = () => {
    props.hideMergeBox();
  }

  const handleMerge = (personId: string) => {
    const person: PersonInterface[] = [...searchResults].filter(p => p.id === personId);
    setPersonToMerge(person[0]);
    setShowMergeModal(true);
  }

  const search = async (searchText: string) => {
    try {
      const results: PersonInterface[] = await ApiHelper.get(`/people/search?term=${escape(searchText)}`, "MembershipApi");
      const filteredList = results.filter(person => person.id !== props.person.id);

      setSearchResults(filteredList);
    } catch (err) {
      console.log("Error occured in fetching search results: ", err);
    }

  }

  const fetchHouseholdMembers = async (householdId: string) => {
    try {
      const members: PersonInterface[] = await ApiHelper.get("/people/household/" + householdId, "MembershipApi");
      return members;
    } catch (err) {
      console.log("Error occured in fetching household members: ", err);
    }
  }

  const fetchGroupMembers = async (personId: string) => {
    try {
      const groups: GroupMemberInterface[] = await ApiHelper.get(`/groupmembers?personId=${personId}`, "MembershipApi");
      return groups;
    } catch (err) {
      console.log("Error in fetching group's data: ", err);
    }
  }

  const fetchNotes = async (contentId: string) => {
    try {
      const notes: NoteInterface[] = await ApiHelper.get(`/notes/person/${contentId}`, "MembershipApi");
      return notes;
    } catch (err) {
      console.log("Error in fetching notes: ", err)
    }
  }

  const fetchVisits = async (personId: string) => {
    try {
      const visits: VisitInterface[] = await ApiHelper.get(`/visits?personId=${personId}`, "AttendanceApi");
      return visits;
    } catch (err) {
      console.log("Error in fetching visits: ", err);
    }
  }

  const fetchDonations = async (personId: string) => {
    try {
      const donations: DonationInterface[] = await ApiHelper.get(`/donations?personId=${personId}`, "GivingApi");
      return donations;
    } catch (err) {
      console.log("Error in fetching donations: ", err);
    }
  }

  const fetchFormSubmissions = async (personId: string) => {
    try {
      const formSubmissions: FormSubmissionInterface[] = await ApiHelper.get(`/formsubmissions?personId=${personId}`, "MembershipApi");
      return formSubmissions;
    } catch (err) {
      console.log("Error in fetching form submissions: ", err)
    }
  }

  const merge = async (person: PersonInterface, personToRemove: PersonInterface) => {
    try {
      setMergeInProgress(true);
      const { id, householdId } = personToRemove;
      const householdMembers = await fetchHouseholdMembers(householdId);
      const groupMembers = await fetchGroupMembers(id);
      const notes = await fetchNotes(id);
      const visits = await fetchVisits(id);
      const donations = await fetchDonations(id);
      const formSubmission = await fetchFormSubmissions(id);

      const promises = [];
      householdMembers.forEach(member => {
        member.householdId = person.householdId;
        promises.push(ApiHelper.post("/people", [member], "MembershipApi"));
      });
      groupMembers.forEach(groupMember => {
        groupMember.personId = person.id;
        promises.push(ApiHelper.post("/groupmembers", [groupMember], "MembershipApi"));
      });
      notes.forEach(note => {
        note.contentId = person.id;
        promises.push(ApiHelper.post("/notes", [note], "MembershipApi"));
      })
      visits.forEach(visit => {
        visit.personId = person.id;
        promises.push(ApiHelper.post(`/visits`, [visit], "AttendanceApi"));
      })
      donations.forEach(donation => {
        donation.personId = person.id;
        promises.push(ApiHelper.post("/donations", [donation], "GivingApi"));
      })
      formSubmission.forEach(form => {
        form.contentId = person.id;
        promises.push(ApiHelper.post("/formsubmissions", [form], "MembershipApi"));
      })
      promises.push(ApiHelper.post(`/people`, [person], "MembershipApi"));
      promises.push(ApiHelper.delete(`/people/${id}`, "MembershipApi"));
      Promise.all(promises).then(() => {
        setShowMergeModal(false);
        history.push("/people");
        setMergeInProgress(false);
      })
    } catch (err) {
      setMergeInProgress(false);
      console.log("Error in merging records...!!", err);
    }
  }

  const person1 = { ...props.person };
  return (
    <>
      <MergeModal show={showMergeModal} onHide={() => setShowMergeModal(false)} person1={person1} person2={personToMerge} merge={merge} mergeInProgress={mergeInProgress} />
      <InputBox id="mergeBox" headerIcon="fas fa-user-plus" headerText="Merge Records" saveFunction={handleSave}>
        <Search handleSearch={search} searchResults={searchResults} buttonText="merge" handleClickAction={handleMerge} />
      </InputBox>
    </>
  )
}
