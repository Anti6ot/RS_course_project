import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentsCreate: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        commentsCreateFailed: (state, action) => {
            state.error = action.error;
        },
        // commentsDeleted: (state, action) => {
        //     // state.entities.filter((c) => c._id !== action._id);
        // } РАБОТАЕТ БЕЗ ИЗМЕНЕНИЯ STATE
        commentsDeletedFailed: (state, action) => {
            state.error = action.error;
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsReceived,
    commentsRequestFailed,
    commentsCreateFailed,
    commentsDeleted,
    commentsDeletedFailed,
    commentsCreate
} = actions;

export const createComments = (comment) => async (dispatch) => {
    try {
        const { content } = await commentService.createComment(comment);
        dispatch(commentsCreate(content));
    } catch (error) {
        dispatch(commentsCreateFailed(error.message));
    }
};
export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const removeComments = (id) => async (dispatch) => {
    try {
        const { content } = await commentService.removeComment(id);
        dispatch(commentsDeleted(content));
    } catch (error) {
        dispatch(commentsDeletedFailed(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
