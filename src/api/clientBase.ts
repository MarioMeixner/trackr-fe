import { paths } from '@/lib/api';
import createClient from 'openapi-fetch';

export const client = createClient<paths>({
  baseUrl: `${process.env.TRACKR_API_URL}`,
});
