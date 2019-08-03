import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import userReducer from './reducers/user-reducer'
import dataReducer from './reducers/data-reducer'
import uiReducer from './reducers/ui-reducer'

const initialState = {}

const middleware = [thunk]

const reducers = combineReducers({
    user: userReducer,
    data: dataReducer,
    ui: uiReducer
})

const logger = createLogger({
    /* https://github.com/evgenyrodionov/redux-logger */
    collapsed: true,
    diff: true
})

const store = createStore(
    reducers, 
    initialState, 
    composeWithDevTools(
        applyMiddleware(...middleware, logger), 
    )
)

export default store