import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { noop } from "@utils"
import type { RootState } from "./index"

interface DockState {
  showDock: () => void
  hideDock: () => void
}

const initialState: DockState = {
  showDock: noop,
  hideDock: noop,
} as any

const dockSlice = createSlice({
  name: "dock",
  initialState,
  reducers: {
    pushDock: (state, action: PayloadAction<DockState>) => {
      const { showDock, hideDock } = action.payload
      state.showDock = showDock
      state.hideDock = hideDock
    },
    removeDock: (state) => {
      state.showDock = noop
      state.hideDock = noop
    },
  },
})

export const { pushDock, removeDock } = dockSlice.actions

export const selectDock = (state: RootState) => state.dock

export const reducers = dockSlice.reducer

export default dockSlice
