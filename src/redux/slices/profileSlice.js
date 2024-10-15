import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,

};

const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers:{
        setUser(state, value){
            state.user = value.payload;
        },
        setLoading(state, value){
            state.loading = value.payload
        },
        setLoginStatus(state, value){
            state.loginStatus = value.payload
        },
    }
})

export const {setUser, setLoading,setLoginStatus} = profileSlice.actions;
export default profileSlice.reducer;