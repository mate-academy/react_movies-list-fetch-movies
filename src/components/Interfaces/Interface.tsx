export interface MovieFromServerInterface {
  Plot: string;
  Poster: string;
  Title: string;
  imdbID: string;
  Response: string;
}

export interface MovieInterface {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}
