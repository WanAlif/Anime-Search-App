import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnimeState } from '../../types/anime';
import { JikanAPI } from '../../services/jikanApi';



const favoritesFromStorage = localStorage.getItem('favorites');
const initialState: AnimeState = {
  results: [],
  selectedAnime: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
  },
  searchQuery: '',
  favorites: favoritesFromStorage ? JSON.parse(favoritesFromStorage) : [],
};

export const searchAnime = createAsyncThunk(
  'anime/search',
  async ({ query, page }: { query: string; page: number }, { rejectWithValue }) => {
    try {
      const data = await JikanAPI.searchAnime(query, page);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchAnimeById = createAsyncThunk(
  'anime/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await JikanAPI.getAnimeById(id);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(fav => fav !== id);
      } else {
        state.favorites.push(id);
      }
      // Persist to localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
    clearSelectedAnime: (state) => {
      state.selectedAnime = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Anime
      .addCase(searchAnime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAnime.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data;
        state.pagination = {
          currentPage: action.payload.pagination.current_page,
          totalPages: action.payload.pagination.last_visible_page,
          hasNextPage: action.payload.pagination.has_next_page,
        };
      })
      .addCase(searchAnime.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== 'Request cancelled') {
          state.error = action.payload as string;
        }
      })
      // Fetch Anime by ID
      .addCase(fetchAnimeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAnime = action.payload;
      })
    
      .addCase(fetchAnimeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleFavorite, setSearchQuery, clearResults, clearSelectedAnime } = animeSlice.actions;
export default animeSlice.reducer;