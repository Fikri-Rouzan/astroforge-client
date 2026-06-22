import { createContext } from "react";
import type { Web3ContextType } from "../types/type.js";

export const Web3Context = createContext<Web3ContextType | undefined>(
  undefined,
);
