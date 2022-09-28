import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { omit } from "lodash"
import type { WindowHandler, ShortcutProps } from "@brc"
import type { RootState } from "./index"

type Key = string
type App = WindowHandler &
  ShortcutProps & {
    id: string
  }

// Define a type for the slice state
interface AppsState {
  running: {
    [key: Key]: App
  }
}

// Define the initial state using that type
const initialState: AppsState = {
  running: {},
}

const appsSlice = createSlice({
  name: "apps",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    push: (
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
    remove: (
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

export const { push, remove } = appsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectApps = (state: RootState) => state.apps.running

export const reducers = appsSlice.reducer

export default appsSlice
