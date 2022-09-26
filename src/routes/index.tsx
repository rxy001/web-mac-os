import { asyncLoadComponent } from "utils"
import appRoutes from "./app"
import Desktop from "../app/Desktop"

// todo 暂时没用到
const routes = [
  {
    path: "/",
    element: <Desktop />,
    children: appRoutes,
  },
  {
    path: "/login",
    element: asyncLoadComponent(() => import("../app/LoginPage")),
  },
]

export default routes
