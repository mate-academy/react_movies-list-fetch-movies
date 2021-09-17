/// <reference types="react-scripts" />

interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

interface MovieFromServer {
  Title: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  Response: 'True' | 'False';
}
