import { SetMetadata } from '@nestjs/common';

export const PAPEIS_KEY = 'papeis';
export const Papeis = (...papeis: string[]) => SetMetadata(PAPEIS_KEY, papeis);
