import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosInstance";

// 🟢 Fetch all courses
export const fetchCourses = createAsyncThunk("courses/fetchAll", async () => {
  const res = await axios.get("/courses");
  return res.data;
});

// 🟢 Search courses
export const searchCourses = createAsyncThunk("courses/search", async (term) => {
  const res = await axios.get(`/courses/search/${term}`);
  return res.data;
});

// 🟢 Add course
export const addCourse = createAsyncThunk("courses/add", async (course) => {
  const res = await axios.post("/courses", course);
  return res.data;
});

// 🟢 Edit course
export const editCourse = createAsyncThunk("courses/edit", async (course) => {
  const res = await axios.put(`/courses/${course._id}`, course);
  return res.data;
});

// 🟢 Delete course
export const deleteCourse = createAsyncThunk("courses/delete", async (id) => {
  await axios.delete(`/courses/${id}`);
  return id;
});

// 🟢 Bulk delete courses
export const bulkDeleteCourses = createAsyncThunk("courses/bulkDelete", async (ids) => {
  await axios.post("/courses/bulk-delete", { ids });
  return ids;
});

const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    list: [],
    loading: false,
    error: null,
    searchTerm: "",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCourses.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch courses";
      })
      .addCase(searchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(searchCourses.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to search courses";
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editCourse.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((c) => c._id === updated._id);
        if (index !== -1) state.list[index] = updated;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c._id !== action.payload);
      })
      .addCase(bulkDeleteCourses.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => !action.payload.includes(c._id));
      });
  },
});

export const { setSearchTerm } = coursesSlice.actions;

export default coursesSlice.reducer;
