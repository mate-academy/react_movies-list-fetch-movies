/// <reference types="react-scripts" />

interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

interface ApiMovie {
  Title: string;
  Poster: string;
  imdbID: string;
  Plot: string;
  Response: 'True' | 'False';
}
