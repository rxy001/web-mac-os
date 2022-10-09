import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { noop } from "@utils"
import type { RootState } from "./index"

interface TarbarState {
  showTopbar: () => void
  hideTopbar: () => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function

const initialState: TarbarState = {
  showTopbar: noop,
  hideTopbar: noop,
} as any

const topbarSlice = createSlice({
  name: "topbar",
  initialState,
  reducers: {
    pushTopbar: (state, action: PayloadAction<TarbarState>) => {
      const { showTopbar, hideTopbar } = action.payload
      state.showTopbar = showTopbar
      state.hideTopbar = hideTopbar
    },
    removeTopbar: (state) => {
      state.showTopbar = noop
      state.hideTopbar = noop
    },
  },
})

export const { pushTopbar, removeTopbar } = topbarSlice.actions

export const selectTopbar = (state: RootState) => state.topbar

export const reducers = topbarSlice.reducer

export default topbarSlice
