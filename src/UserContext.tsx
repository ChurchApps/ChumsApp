import React from "react"
import {PersonHelper, PersonInterface} from "./helpers";

export interface UserContextInterface {
  userName: string,
  setUserName: (userName: string) => void,
  churchName: string,
  setChurchName: (churchName: string) => void,
  profilePicture: string,
  setProfilePicture: (profilePicture: string) => void,
  person: PersonInterface | null,
  setPerson: (person: PersonInterface) => void,
}

const UserContext = React.createContext<UserContextInterface | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({children}: Props) => {
  const [userName, setUserName] = React.useState("");
  const [churchName, setChurchName] = React.useState("");
  const [profilePicture, setProfilePicture] = React.useState(PersonHelper.getPhotoUrl(null));
  const [person, setPerson] = React.useState(null);
  return <UserContext.Provider value={{
    userName,
    setUserName,
    churchName,
    setChurchName,
    profilePicture,
    setProfilePicture,
    person,
    setPerson
  }}>{children} </UserContext.Provider>
};

export default UserContext;

