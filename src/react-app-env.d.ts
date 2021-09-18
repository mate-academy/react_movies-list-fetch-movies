/// <reference types="react-scripts" />

type Movie = {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
};

type ResponceBody = {
  Response: string;
} & Movie;
