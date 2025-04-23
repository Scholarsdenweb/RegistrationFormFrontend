import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Thunk to fetch user details
export const fetchExistingUserDetails = createAsyncThunk(
    'userDetails/fetchExistingUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/students/getAllStudentByPhone');
            const data = response.data;
            console.log("Studennt  Data", data);

            if (data.length !== 0) {
                return {
                    dataExist: true, // Indicate data exists
                    userData: data
                };
            } else {
                return {
                    dataExist: false, // Indicate no data exists
                    formData: {}, // Default empty data
                };
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);
export const fetchExistingUserFormEnquiryDetails = createAsyncThunk(
    'userDetails/fetchExistingUserFormEnquiryDetails',
    async (_, { rejectWithValue }) => {
        try {

            console.log("FetchExistingUserFormEnquiryDetails is calling")
            const response = await axios.post('/students/fetchExistingUserFormEnquiryDetails');
            const data = response.data.data;
            console.log("Studennt  Data", data);


            if (data.length) {
                return {
                    dataExist: true, // Indicate data exists
                    userData: data
                };
            } else {
                return {
                    dataExist: false, // Indicate no data exists
                    formData: {}, // Default empty data
                };
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);

export const submitExistingUserDetails = createAsyncThunk(
    'existingUserDetails/updateExistingUserDetails',
    async ( formData , { rejectWithValue }) => {
        try {
            
            console.log("formData from submitUserDetails", formData);
            const response = await axios.patch('/students/editStudent', formData);
            console.log("response from submitsuserDetails", response);
            const data = response.data;
            if (data.length !== 0) {
                return {
                    dataExist: true, // Indicate data exists
                    userData: {
                        name: data?.name || '',
                        StudentsId: data?.StudentsId || '',
                        email: data?.email || '',
                        admitCard: data?.admitCard || '',
                        result: data?.result || '',
                        paymentId: data?.paymentId || '',
                        phone: data?.phone || '',
                        profilePicture: data?.profilePicture || '',
                    },
                };
            } else {
                return {
                    dataExist: false, // Indicate no data exists
                    formData: {}, // Default empty data
                };
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update user details');
        }
    }
);



// Slice
const existingUserDetailsSlice = createSlice({
    name: 'existingUserDetails',
    initialState: {
        userData: {},
        loading: false,
        error: null,
        dataExist: false, // New flag to indicate if data exists in the database

    },
    reducers: {
        updateExistingUserDetails(state, action) {
            state.userData = { ...state.userData, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExistingUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExistingUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.userData;
                state.dataExist = action.payload.dataExist; // Update `dataExist`

            })
            .addCase(fetchExistingUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchExistingUserFormEnquiryDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExistingUserFormEnquiryDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.userData;
                state.dataExist = action.payload.dataExist; // Update `dataExist`

            })
            .addCase(fetchExistingUserFormEnquiryDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitExistingUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitExistingUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.userData;
                state.dataExist = action.payload.dataExist; // Update `dataExist`
            })
            .addCase(submitExistingUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const { updateExistingUserDetails } = existingUserDetailsSlice.actions;
export default existingUserDetailsSlice.reducer;
