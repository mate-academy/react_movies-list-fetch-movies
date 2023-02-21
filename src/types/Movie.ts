export interface Movie {
  Error?: string;
  Plot: string;
  Poster: string | undefined;
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}
