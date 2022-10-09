import { configureStore } from "@reduxjs/toolkit"
import appsSlice from "./appsSlice"
import dockSlice from "./dockSlice"

const store = configureStore({
  reducer: {
    apps: appsSlice.reducer,
    dock: dockSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
