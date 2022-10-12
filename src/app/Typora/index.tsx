import { App } from "@brc"
import typoraImg from "../../assets/typora.png"

const importTypora = () => import("./Typora")

const defaultSize = {
  width: 500,
  height: 200,
}

export default function Typora() {
  return (
    <App
      defaultSize={defaultSize}
      icon={typoraImg}
      title="typora"
      element={importTypora}
    />
  )
}
