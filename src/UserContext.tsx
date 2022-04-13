import React from "react"
import { PersonHelper } from "./helpers";

export interface UserContextInterface {
  userName: string,
  setUserName: (userName: string) => void,
  churchName: string,
  setChurchName: (churchName: string) => void,
  profilePicture: string,
  setProfilePicture: (churchName: string) => void,
}

const UserContext = React.createContext<UserContextInterface | undefined>(undefined);
interface Props { children: React.ReactNode; }

export const UserProvider = ({ children }: Props) => {
  const [userName, setUserName] = React.useState("");
  const [churchName, setChurchName] = React.useState("");
  const [profilePicture, setProfilePicture] = React.useState(PersonHelper.getPhotoUrl(null));
  return <UserContext.Provider value={{ userName, setUserName, churchName, setChurchName, profilePicture, setProfilePicture }}>{children} </UserContext.Provider>
};

export default UserContext;

