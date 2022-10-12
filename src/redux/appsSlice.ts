import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { omit } from "lodash"
import type { RootState } from "./index"

type Key = string
type App = {
  id: string
  title: string
  isMaximized: () => boolean
  isFullscreen: () => boolean
  isActivated: () => boolean
  renderDockShortcut: (a?: number, b?: number) => JSX.Element
}

interface AppsState {
  running: {
    [key: Key]: App
  }
}

const initialState: AppsState = {
  running: {},
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
      state.running = {
        ...state.running,
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
      state.running = omit(state.running, [key])
    },
  },
})

export const { pushApp, removeApp } = appsSlice.actions

export const selectApps = (state: RootState) => state.apps.running

export const reducers = appsSlice.reducer

export default appsSlice
