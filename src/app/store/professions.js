import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";

const professionSlice = createSlice({
    name: "professions",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        professionsRequested: (state) => {
            state.isLoading = true;
        },
        professionsRecived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        professionsRequestFiled: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

const { reducer: professionsReducer, actions } = professionSlice;
const { professionsRequested, professionsRecived, professionsRequestFiled } =
    actions;
export const loadProfessionsList = () => async (dispatch) => {
    dispatch(professionsRequested());
    try {
        const { content } = await professionService.get();
        dispatch(professionsRecived(content));
    } catch (error) {
        dispatch(professionsRequestFiled(error.message));
    }
};

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionsLoadingStatus = () => (state) =>
    state.professions.isLoading;
export const getProfessionsByIds = (professionsIds) => (state) => {
    if (state.professions.entities) {
        for (const profIds of state.professions.entities) {
            if (profIds._id === professionsIds) {
                return profIds;
            }
        }
    }
    return [];
};

export default professionsReducer;
