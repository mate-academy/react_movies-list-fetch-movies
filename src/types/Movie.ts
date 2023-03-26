export interface Movie {
  title: string;
  imgUrl: string;
  imdbId: string;
  imdbUrl: string;
  description: string;
}

export interface MovieCardImg {
  url: string;
  alt: string;
  dataCy?: string;
  className?: string;
}

export interface MovieCardDescripton {
  imdbUrl: string;
  description: string;
}
