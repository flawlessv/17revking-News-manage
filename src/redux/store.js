import { createStore } from "redux";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import {collapsedReducer} from './reducer/collapsedReducer'
import { SpinReducer } from "./reducer/SpinReducer";
const persistConfig = {
    key: 'redux-persist',
    storage,
    blacklist:'SpinReducer'
  }
  
const reducer=combineReducers({
    collapsedReducer,
    SpinReducer
})
const persistedReducer = persistReducer(persistConfig, reducer)
let store = createStore(persistedReducer)
let persistor = persistStore(store)
export { store, persistor }
  