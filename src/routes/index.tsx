import { asyncLoadComponent } from "@utils"
import appRoutes from "./app"
import Desktop from "../page/Desktop"

const routes = [
  {
    path: "/",
    element: <Desktop />,

    children: appRoutes,
  },
  {
    path: "/login",
    element: asyncLoadComponent(() => import("../page/LoginPage")),
  },
]

export default routes
