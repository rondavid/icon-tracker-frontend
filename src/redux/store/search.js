import { makeUrl } from '../../utils/utils';
import * as deepcopy from 'deepcopy'
import { trackerApiInstance } from '../api/restV3/config'

const SEARCH_BLOCKS = 'SEARCH_BLOCKS'

const getsearchBlocks = (payload) => ({
    type: SEARCH_BLOCKS,
    payload
})


export const searchBlocks = (payload) => async (dispatch) => {
    const trackerApi = await trackerApiInstance()
    try { 
        const response = trackerApi.get(makeUrl('/v1/blocks/', payload));
        if (response.data) {
            const resultData = await response.data.data;
            dispatch(getsearchBlocks(resultData))
            return resultData
    }}
    catch (e) {
        console.log(e, "e from search")
    }
}



const initialState = {
    loading: false,
    error: ''
  };
  
let newState;
const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_BLOCKS: {
            newState = deepcopy(state);
            newState = action.payload
            return newState;
        }
        default: 
            return state;
    }
}

export default searchReducer