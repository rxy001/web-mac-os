import { asyncLoadComponent } from "utils"
import appRoutes from "./app"
import Desktop from "../app/Desktop"

const routes = [
  {
    path: "/",
    element: <Desktop />,

    // todo 暂时没用到
    children: appRoutes,
  },
  {
    path: "/login",
    element: asyncLoadComponent(() => import("../page/LoginPage")),
  },
]

export default routes
