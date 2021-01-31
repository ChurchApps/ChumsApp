import React from "react"

export interface UserContextInterface {
  userName: string,
  setUserName: (userName: string) => void,
  churchName: string,
  setChurchName: (churchName: string) => void,
}

const UserContext = React.createContext<UserContextInterface | undefined>(undefined);
interface Props { children: React.ReactNode; }

export const UserProvider = ({ children }: Props) => {
  const [userName, setUserName] = React.useState("");
  const [churchName, setChurchName] = React.useState("");
  return <UserContext.Provider value={{ userName, setUserName, churchName, setChurchName }}>{children} </UserContext.Provider>
};

export default UserContext;

