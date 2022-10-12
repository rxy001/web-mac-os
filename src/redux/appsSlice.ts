import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { omit } from "lodash"
import type { RootState } from "./index"

type Key = string
type App = {
  id: string
  title: string
  renderDockShortcut: (a?: number, b?: number) => JSX.Element
}

interface AppsState {
  all: {
    [key: Key]: App
  }
}

const initialState: AppsState = {
  all: {},
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
      state.all = {
        ...state.all,
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
      state.all = omit(state.all, [key])
    },
  },
})

export const { pushApp, removeApp } = appsSlice.actions

export const selectApps = (state: RootState) => state.apps.all

export const reducers = appsSlice.reducer

export default appsSlice
