import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Thunk to fetch basic details
export const fetchExamDate = createAsyncThunk(
  "examDate/fetchExamDate",
  async (_, { rejectWithValue }) => {
    try {
      console.log("It running");
      const response = await axios.get("/employees/getAllDates");
      const data = response.data;

      console.log("data", data);
      if (data.length > 0) {
        return {
        examDate: data
        };
      } else {
        return {
          dataExist: false, // Indicate no data exists
          formData: {}, // Default empty data
        };
      }
    } catch (error) {
      console.error("Error caught in fetchexamDate:", error);

      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);

// Slice
const examDateSlice = createSlice({
  name: "examDate",
  initialState: {
    examDate: [],
    loading: false,
    error: null,
    dataExist: false, // New flag to indicate if data exists in the database
  },
  reducers: {
    updateExamDate(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamDate.pending, (state) => {
        console.log("Payload pending fetchExamDate received");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamDate.fulfilled, (state, action) => {
        console.log(
          "Payload fullfilled fetchExamDate received:",
          action.payload
        );

        state.loading = false;
        state.examDate = action.payload.examDate;
        state.dataExist = action.payload.dataExist; // Update `dataExist`
      })
      .addCase(fetchExamDate.rejected, (state, action) => {
        console.log("Payload rejected fetchExamDate received:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateExamDate } = examDateSlice.actions;
export default examDateSlice.reducer;
