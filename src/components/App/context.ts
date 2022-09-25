import { createContext } from "react";
import { AppContextProps } from "./interface";

export const AppContext = createContext<AppContextProps>({} as any);
