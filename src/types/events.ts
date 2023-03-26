import { ChangeEvent, FormEvent } from 'react';
import { MovieData } from './MovieData';
import { ResponseError } from './ReponseError';

export type OnChange = (event: ChangeEvent<HTMLInputElement>) => void;

export type OnSumbit = (event: FormEvent<HTMLFormElement>) => void;

export type GetMovie = (query: string) => Promise<MovieData | ResponseError>;
