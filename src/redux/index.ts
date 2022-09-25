import { configureStore } from "@reduxjs/toolkit";
import appsSlice from "./appsSlice";

const store = configureStore({
  reducer: {
    apps: appsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { appsSlice };
