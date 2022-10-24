import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { findIndex, some } from "lodash"
import type { RootState } from "./index"

type App = {
  appName: string
  renderDockShortcut: () => JSX.Element
}

interface AppsState {
  inDock: App[]
}

const initialState: AppsState = {
  inDock: [],
}

const appsSlice = createSlice({
  name: "apps",
  initialState,
  reducers: {
    pushApp: (state, action: PayloadAction<App>) => {
      const app = action.payload
      if (!some(state.inDock, (v) => v.appName === app.appName)) {
        state.inDock = [...state.inDock, app]
      }
    },
    removeApp: (state, action: PayloadAction<string>) => {
      const appName = action.payload
      const index = findIndex(state.inDock, ["appName", appName])
      if (index !== -1) {
        const temp = [...state.inDock]
        temp.splice(index, 1)
        state.inDock = temp
      }
    },
  },
})

export const { pushApp, removeApp } = appsSlice.actions

export const selectApps = (state: RootState) => state.apps.inDock

export const reducers = appsSlice.reducer

export default appsSlice
