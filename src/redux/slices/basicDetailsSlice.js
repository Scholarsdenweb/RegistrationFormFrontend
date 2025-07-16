import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Thunk to fetch basic details
export const fetchBasicDetails = createAsyncThunk(
  "basicDetails/fetchBasicDetails",
  async (_, { rejectWithValue }) => {
    try {


      console.log("It running")
      const response = await axios.get("/form/basicDetails/getForm");
      const data = response.data;

      console.log("data form basicDetails fetchBasicDetails", data);
      console.log("data form basicDetails fetchBasicDetails", data.length);
      if (data.length > 0) {
        return {
          dataExist: true, // Indicate data exists
          formData: {
            dob: data[0]?.dob?.split("T")[0] || "",
            gender: data[0]?.gender || "",
            examName: data[0]?.examName || "",
            examDate:  data[0]?.examDate?.split("T")[0] || "",
          },
        };
      } else {
        return {
          dataExist: false, // Indicate no data exists
          formData: {}, // Default empty data
        };
      }
    } catch (error) {
      console.error("Error caught in fetchBasicDetails:", error);

      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);

// Slice
const basicDetailsSlice = createSlice({
  name: "basicDetails",
  initialState: {
    data: {},
    loading: false,
    error: null,
    dataExist: false, // New flag to indicate if data exists in the database
  },
  reducers: {
    updateBasicDetails(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBasicDetails.pending, (state) => {
        console.log("Payload pending fetchBasicDetails received");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBasicDetails.fulfilled, (state, action) => {
        console.log("Payload fullfilled fetchBasicDetails received:", action.payload);
        
        state.loading = false;
        state.data = action.payload.formData;
        state.dataExist = action.payload.dataExist; // Update `dataExist`
      })
      .addCase(fetchBasicDetails.rejected, (state, action) => {
        console.log("Payload rejected fetchBasicDetails received:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateBasicDetails } = basicDetailsSlice.actions;
export default basicDetailsSlice.reducer;
