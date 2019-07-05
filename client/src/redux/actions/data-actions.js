import { 
    SET_GIBBERS, 
    LOADING_DATA, 
    LIKE_GIBBER, 
    UNLIKE_GIBBER,
    DELETE_GIBBER,
    LOADING_UI,
    SET_ERRORS,
    CLEAR_ERRORS,
    POST_GIBBER,
    SET_GIBBER,
    STOP_LOADING_UI,
    SUBMIT_COMMENT
} from '../types'
import axios from 'axios'

// Get all gibbers
export const getGibbers = () => (dispatch) => {
    dispatch({ type: LOADING_DATA })
    axios.get('/gibbers')
        .then(res => {
            dispatch({
                type: SET_GIBBERS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_GIBBERS,
                payload: []
            })
        })
}

// Post a gibber
export const postGibber = (newGibber) => (dispatch) => {
    dispatch({ type: LOADING_UI })
    console.log(newGibber);
    
    axios.post('/gibber', newGibber)
        .then(res => {
            dispatch({
                type: POST_GIBBER,
                payload: res.data
            })
            dispatch(clearErrors())
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

// Like a gibber
export const likeGibber = (gibberId) => (dispatch) => {
    axios.get(`/gibber/${gibberId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_GIBBER,
                payload: res.data
            })
        })
        .catch(err => console.log(err))
}

// Unlike a gibber
export const unlikeGibber = (gibberId) => (dispatch) => {
    axios.get(`/gibber/${gibberId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_GIBBER,
                payload: res.data
            })
        })
        .catch(err => console.log(err))
}

// Submit a comment
export const submitComment = (gibberId, commentData) => (dispatch) => {
    axios.post(`/gibber/${gibberId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            })
            dispatch(clearErrors())
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

// Delete a gibber
export const deleteGibber = (gibberId) => (dispatch) => {
    axios.delete(`/gibber/${gibberId}`)
        .then(() => {
            dispatch({
                type: DELETE_GIBBER,
                payload: gibberId
            })
        })
        .catch(err => console.log(err))
}

// Clear errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}

// Get a single gibber
export const getGibber = (gibberId) => (dispatch) => {
    dispatch({ type: LOADING_UI })
    axios.get(`/gibber/${gibberId}`)
        .then(res => {
            dispatch({
                type: SET_GIBBER,
                payload: res.data
            })
            dispatch({ type: STOP_LOADING_UI })
        })
        .catch(err => console.log(err))
}

// Get user profile
export const getUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_DATA })
    axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({
                type: SET_GIBBERS,
                payload: res.data.gibbers
            })
        })
        .catch(err => {
            dispatch({
                type: SET_GIBBERS,
                payload: null
            })
        })
}