import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    category:[],
}

export const UserSlice = createSlice({
    name:"categories",
    initialState,
    reducers:{
        updateCategory:(state,action)=>{
            return {...action.payload}
        }
    }
})

export const {updateCategory} = UserSlice.actions

export default UserSlice.reducer