import { format } from 'date-fns';

export const formatDate = (input: string) => format(new Date(input), 'PP p');
