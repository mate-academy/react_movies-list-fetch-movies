export interface MovieFromServer {
  Plot: string;
  Poster: string;
  Title: string;
  imdbID: string;
  Response: string;
}

export interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}
