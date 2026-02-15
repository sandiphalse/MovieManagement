export interface Movie {
  id?: number;
  title: string;
  directors: string;
  actors: string;
  releaseDate: string;
  runtime: string;
  genre: string;
  plot?: string | null;
  rating?: number | null;
  imageUrl?: string | null;
}