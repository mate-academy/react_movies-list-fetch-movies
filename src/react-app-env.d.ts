/// <reference types="react-scripts" />

interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbId: string;
  imdbUrl: string;
}

interface APIMovie {
  Response: string;
  Title: string;
  Plot: string;
  Poster: string;
  imdbID: string;
}
