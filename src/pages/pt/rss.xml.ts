import type { APIRoute } from 'astro';
import { rssResponse } from '../../lib/blog';

export const GET: APIRoute = ({ site }) => rssResponse('pt', site!);
