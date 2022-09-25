import { asyncLoadComponent } from "utils";

const appRoutes = [
  {
    path: "/typora",
    element: asyncLoadComponent(() => import("../app/Typora")),
  },
];

export default appRoutes;
