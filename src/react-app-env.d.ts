/// <reference types="react-scripts" />

interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
  Poster?: string;
}

interface FoundedMovie {
  Response: string;
  Title: string;
  Plot: string;
  Poster: string;
  imdbID: string;
}
