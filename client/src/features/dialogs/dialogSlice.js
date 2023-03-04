import { createSlice } from "@reduxjs/toolkit";

export const dialogSlice = createSlice({
    name: "dialogs",
    initialState: {
        dialogDelete: false,
        dialogCreateUpdate: false,
        dialogType: "",
    },
    reducers: {
        openDialog: (state, action) => {
            state[action.payload] = true;
        },
        closeDialog: (state, action) => {
            state[action.payload] = false;
        },
        setDialogType: (state, action) => {
            state.dialogType = action.payload;
        }
    }
})

export const {openDialog, closeDialog, setDialogType} = dialogSlice.actions;

export default dialogSlice.reducer;