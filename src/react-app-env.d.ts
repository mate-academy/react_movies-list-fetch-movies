// eslint-disable-next-line
/// <reference types="react-scripts" />

interface Movie {
  title?: string;
  description?: string;
  imgUrl?: string;
  imdbUrl?: string;
  imdbId?: string;
}

interface Ratings {
  Source: string;
  Value: string;
}

interface NewMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Ratings[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
}

interface OmdbResponse {
  Response: 'True' | 'False';
  Error?: string;
  [key: string]: any;
}
