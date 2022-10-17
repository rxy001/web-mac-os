import { useRef } from "react"
import type { ReactElement, ReactFragment } from "react"
import { GroupContext } from "./context"
import type { CurrentPopup, CurrentMotion, GroupContextType } from "./interface"

// group 内 trigger 只会同时显示一个 popup
export default function Group({
  children,
}: {
  children: ReactElement | ReactElement[] | ReactFragment
}) {
  const Group = useRef<GroupContextType>({
    currentPopup: null,
    setCurrentPopup: (popup: CurrentPopup) => {
      Group.current.currentPopup = popup
    },
    currentMotion: null,
    setCurrentMotion: (motion: CurrentMotion) => {
      Group.current.currentMotion = motion
    },
  })

  return (
    <GroupContext.Provider value={Group.current}>
      {children}
    </GroupContext.Provider>
  )
}
