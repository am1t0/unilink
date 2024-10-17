import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: []
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state)=>{
            state.mode = state.mode === 'light'?'dark':'light';
        },
        setLogin: (state, action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state)=>{
            state.user = null;
            state.token = null;
        },
        setConnections:(state, action)=>{
            if(state.user){    
              state.user.connections = action.payload.connections_data;

            } else {
                console.error("User not exists")
            }
        },
        setPosts: (state,action)=>{
            state.posts = action.payload.posts;
        },
        setPost : (state, action)=>{
             const updatedPost = state.posts.map((post)=>{
                if(post._id === action.payload.post._id) return action.payload.post;
                return post;
             })
             state.posts = updatedPost;
        },
        setNewPost: (state, action) => {
            const newPost = action.payload.post_data; // Assuming the new post is sent in the payload
            state.posts = [newPost, ...state.posts];
        },
        setDeletePost: (state, action) => {
            const updatedList = state.posts.filter((post)=> post._id!== action.payload.post_id)
            state.posts  = updatedList; 
        }
    }
})

export const { setMode , setDeletePost, setLogin, setLogout , setConnections, setPosts , setPost, setNewPost} = authSlice.actions;

export default authSlice.reducer;