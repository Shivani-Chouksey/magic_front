import { configureStore, applyMiddleware} from "@reduxjs/toolkit"
import rootReducer from "./reducers"
import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore,  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, } from "redux-persist"

const persistConfig = {
  key: "root",
  storage,
}

const persistReducers = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer:persistReducers,
  
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }) ,
//   devTools:false

})

const persistor = persistStore(store)

persistor.subscribe(() => {
  console.log('Redux State Rehydrated:', store.getState());
});



export {store, persistor}
 