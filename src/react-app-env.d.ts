/// <reference types="react-scripts" />

// interface Movie {
//   title: string;
//   description: string;
//   imgUrl: string;
//   imdbUrl: string;
//   imdbId: string;
// }

interface Movie {
  Title: string;
  Plot: string;
  Poster: string;
  imdbUrl: string;
  imdbID: string;
  Error?: string | undefined;
}
