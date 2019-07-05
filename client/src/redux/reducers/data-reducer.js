import { SET_GIBBERS, LIKE_GIBBER, UNLIKE_GIBBER, LOADING_DATA, DELETE_GIBBER, POST_GIBBER, SET_GIBBER, SUBMIT_COMMENT } from '../types'

const initialState = {
    gibbers: [],
    gibber: {},
    loading: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }

        case SET_GIBBERS:
            return {
                ...state,
                gibbers: action.payload,
                loading: false
            }

        case SET_GIBBER:
            return {
                ...state,
                gibber: action.payload
            }

        case LIKE_GIBBER:
        case UNLIKE_GIBBER:
            let gibberIndex = state.gibbers.findIndex((gibber) => gibber.gibberId === action.payload.gibberId)
            state.gibbers[gibberIndex] = action.payload
            if (state.gibber.gibberId === action.payload.gibberId) {
                state.gibber = action.payload
            }
            return {
                ...state
            }

        case DELETE_GIBBER:
            let deleteGibberIndex = state.gibbers.findIndex(gibber => gibber.gibberId === action.payload)
            state.gibbers.splice(deleteGibberIndex, 1)
            return {
                ...state
            }

        case POST_GIBBER:
            return {
                ...state,
                gibbers: [
                    action.payload,
                    ...state.gibbers
                ]
            }

        case SUBMIT_COMMENT:
            return {
                ...state,
                gibber: {
                    ...state.gibber,
                    comments: [
                        action.payload,
                        ...state.gibber.comments
                    ]
                }
            }
        
        default:
            return state
    }
}