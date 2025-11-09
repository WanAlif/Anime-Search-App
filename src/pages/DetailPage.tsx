import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchAnimeById, clearSelectedAnime } from '../store/slices/animeSlice';
import { ArrowLeft, Star, Film, Calendar, Clock} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ErrorMessage } from '../components/ErrorMessage';


export const DetailPage: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAnime, loading, error } = useSelector(
    (state: RootState) => state.anime
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAnimeById(parseInt(id, 10)));
    }
    return () => {
      dispatch(clearSelectedAnime());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-32 bg-muted rounded" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="aspect-[3/4] bg-muted rounded-lg" />
              <div className="md:col-span-2 space-y-4">
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!selectedAnime) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        {/* Hero Section - Image + Title/Synopsis */}
<div className="grid md:grid-cols-5 gap-8 mb-8">
  {/* Left: Poster Image */}
  <div className="md:col-span-1">
    <Card className="overflow-hidden sticky top-8 shadow-xl">
      <img
        src={selectedAnime.images.jpg.large_image_url}
        alt={selectedAnime.title}
        className="w-full aspect-[3/4] object-cover"
      />
    </Card>
  </div>

  {/* Right: Title + Synopsis */}
  <div className="md:col-span-3 space-y-6">
    {/* Title Section */}
    <div>
      <h1 className="text-5xl font-bold mb-3 leading-tight">
        {selectedAnime.title}
      </h1>
      {selectedAnime.title_english && selectedAnime.title_english !== selectedAnime.title && (
        <p className="text-xl text-muted-foreground mb-4 font-light">
          {selectedAnime.title_english}
        </p>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        {selectedAnime.score && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-4 py-2 rounded-full backdrop-blur-sm">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{selectedAnime.score}</span>
          </div>
        )}
        {selectedAnime.type && (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <Film className="h-4 w-4" />
            <span className="font-medium">{selectedAnime.type}</span>
          </div>
        )}
        {selectedAnime.status && (
          <div className="bg-secondary/50 border border-secondary px-4 py-2 rounded-full backdrop-blur-sm font-medium">
            {selectedAnime.status}
          </div>
        )}
      </div>
    </div>

    {/* Synopsis Card - Scrollable */}
    {selectedAnime.synopsis && (
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl flex items-center gap-2">
            <div className="h-1 w-8 bg-primary rounded-full"></div>
            Synopsis
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-y-auto pr-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            {selectedAnime.synopsis}
          </p>
        </CardContent>
      </Card>
    )}
  </div>
</div>

{/* Information Grid Below */}
<div className="grid sm:grid-cols-2 gap-6 mb-6">
  <Card>
      <CardHeader>
        <CardTitle className="text-lg">Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedAnime.episodes && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Episodes:</span>
            <span className="font-medium">{selectedAnime.episodes}</span>
          </div>
        )}

        {selectedAnime.duration && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {selectedAnime.duration}
            </span>
          </div>
        )}

        {selectedAnime.year && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Year:</span>
            <span className="font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {selectedAnime.year}
            </span>
          </div>
        )}

        {selectedAnime.rating && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rating:</span>
            <span className="font-medium">{selectedAnime.rating}</span>
          </div>
        )}
      </CardContent>
    </Card>

    {selectedAnime.aired && (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aired</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedAnime.aired.from && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium">
                {new Date(selectedAnime.aired.from).toLocaleDateString()}
              </span>
            </div>
          )}

          {selectedAnime.aired.to && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">To:</span>
              <span className="font-medium">
                {new Date(selectedAnime.aired.to).toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    )}
  </div>

{/* Genres Section */}
{selectedAnime.genres.length > 0 && (
  <Card className="mb-6 shadow-lg">
    <CardHeader>
      <CardTitle className="text-xl flex items-center gap-2">
        <div className="h-1 w-8 bg-primary rounded-full"></div>
        Genres
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2">
        {selectedAnime.genres.map((genre) => (
          <span
            key={genre.mal_id}
            className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 px-4 py-2 rounded-full text-sm font-medium hover:from-primary/30 hover:to-primary/20 transition-all"
          >
            {genre.name}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
)}

{/* Studios Section */}
{selectedAnime.studios.length > 0 && (
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="text-xl flex items-center gap-2">
        <div className="h-1 w-8 bg-primary rounded-full"></div>
        Studios
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2">
        {selectedAnime.studios.map((studio) => (
          <span
            key={studio.mal_id}
            className="bg-secondary/70 border border-secondary px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
          >
            {studio.name}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
)}
  
</div>
    </div>
    
  );
};


