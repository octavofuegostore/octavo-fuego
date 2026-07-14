import type { APIRoute, GetStaticPaths } from 'astro';
import { locales, type Locale } from '@/i18n';
import { generateLlmsFullTxt } from '@/lib/seo/llms';

export const getStaticPaths: GetStaticPaths = () => {
  return locales.map((locale) => ({ params: { locale } }));
};

export const GET: APIRoute = ({ params }) => {
  const locale = (params.locale as Locale) || 'es';
  const body = generateLlmsFullTxt(locale);

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
