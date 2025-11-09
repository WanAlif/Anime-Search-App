import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Anime } from '../types/anime';
import { Card, CardContent } from './ui/card';

interface AnimeCardProps {
  anime: Anime;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/anime/${anime.mal_id}`);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-white/20 group"
      onClick={handleClick}
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted relative">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {/* Score Badge Overlay */}
        {anime.score && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-white text-sm">{anime.score}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium">{anime.type || 'N/A'}</span>
          {anime.episodes && (
            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
              {anime.episodes} eps
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};