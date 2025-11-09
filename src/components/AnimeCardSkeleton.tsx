import React from 'react';
import { Card, CardContent } from './ui/card';

export const AnimeCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[3/4] bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:1000px_100%]" />
      <CardContent className="p-4 space-y-2">
        <div className="h-5 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:1000px_100%] rounded" />
        <div className="h-4 w-2/3 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:1000px_100%] rounded" />
      </CardContent>
    </Card>
  );
};