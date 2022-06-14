import React from "react"
import { ChurchInterface, PersonInterface, UserContextInterface, UserInterface } from "./helpers";

const UserContext = React.createContext<UserContextInterface | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<UserInterface>(null);
  const [person, setPerson] = React.useState<PersonInterface>(null);
  const [church, setChurch] = React.useState<ChurchInterface>(null);
  const [churches, setChurches] = React.useState<ChurchInterface[]>(null);

  return <UserContext.Provider value={{
    user,
    setUser,
    church,
    setChurch,
    churches,
    setChurches,
    person,
    setPerson
  }}>{children} </UserContext.Provider>
};

export default UserContext;


