import React from "react";

import { IStores } from "./Stores";

const StoresContext = React.createContext<IStores>(undefined as any);

export default StoresContext;
