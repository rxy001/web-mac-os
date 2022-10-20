import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { omit } from "lodash"
import type { RootState } from "./index"

type Key = string
type App = {
  title: string
  renderDockShortcut: (a?: number, b?: number) => JSX.Element
}

interface AppsState {
  inDock: {
    [key: Key]: App
  }
}

const initialState: AppsState = {
  inDock: {},
}

const appsSlice = createSlice({
  name: "apps",
  initialState,
  reducers: {
    pushApp: (
      state,
      action: PayloadAction<{
        key: Key
        app: App
      }>,
    ) => {
      const { key, app } = action.payload
      state.inDock = {
        ...state.inDock,
        [key]: app,
      }
    },
    removeApp: (
      state,
      action: PayloadAction<{
        key: Key
      }>,
    ) => {
      const { key } = action.payload
      state.inDock = omit(state.inDock, [key])
    },
  },
})

export const { pushApp, removeApp } = appsSlice.actions

export const selectApps = (state: RootState) => state.apps.inDock

export const reducers = appsSlice.reducer

export default appsSlice
