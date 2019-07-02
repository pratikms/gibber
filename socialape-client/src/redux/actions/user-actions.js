import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../types'
import axios from 'axios'

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI })
    axios.post('/login', userData)
    .then(res => {
        console.log(res.data)
        const FirebaseToken = `Bearer ${res.data.token}`
        localStorage.setItem('FirebaseToken', FirebaseToken)
        axios.defaults.headers.common['Authorization'] = FirebaseToken
        dispatch(getUserData())
        dispatch({ type: CLEAR_ERRORS })
        history.push('/')
    })
    .catch(err => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data
        })
    })
}

export const getUserData = () => (dispatch) => {
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            })
        })
        .catch(err => console.error(err))
}