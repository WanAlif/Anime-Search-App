import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { searchAnime, setSearchQuery, clearResults } from '../store/slices/animeSlice';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/SearchBar';
import { AnimeCard } from '../components/AnimeCard';
import { AnimeCardSkeleton } from '../components/AnimeCardSkeleton';
import { Pagination } from '../components/Pagination';
import { ErrorMessage } from '../components/ErrorMessage';
import { JikanAPI } from '../services/jikanApi';
import { ThemeToggle } from '../components/ThemeToggle';


export const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { results, loading, error, pagination, searchQuery } = useSelector(
    (state: RootState) => state.anime
  );

  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(inputValue, 250);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));

    if (debouncedSearchQuery.trim()) {
      dispatch(searchAnime({ query: debouncedSearchQuery, page: 1 }));
    } else {
      dispatch(clearResults());
    }

    return () => {
      JikanAPI.cancelRequests();
    };
  }, [debouncedSearchQuery, dispatch]);

  const handlePageChange = (page: number) => {
    if (searchQuery.trim()) {
      dispatch(searchAnime({ query: searchQuery, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, index) => (
            <AnimeCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (!searchQuery.trim()) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-2">Search for Anime</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Start typing in the search bar to discover your favorite anime
          </p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We couldn't find any anime matching "{searchQuery}". Try different keywords.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {results.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
            />
          </div>
        )}
      </>
    );
  };

  return (
  <div className="min-h-screen bg-background relative">
    {/* Background Layer */}
    <div 
      className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000)',
      }}
    >
      {/* Dark Overlay with Blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 backdrop-blur-sm"></div>
    </div>

    {/* Content Layer */}
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
      <ThemeToggle />  {/* ← Add this */}
      </div>
    </div>
    <div className="relative z-10 container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* Header with Glassmorphism */}
        <div className="text-center mb-6 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Anime Search
          </h1>
          <p className="text-gray-300 text-lg">
            Discover your next favorite anime
          </p>
        </div>
        
        {/* Search Bar with Enhanced Styling */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-2xl">
            <SearchBar
              value={inputValue}
              onChange={setInputValue}
              placeholder="Search anime by title..."
            />
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  </div>
);
};