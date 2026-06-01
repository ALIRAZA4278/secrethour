import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/checkout/confirm'],
      },
      { userAgent: 'GPTBot',        allow: '/' },
      { userAgent: 'ChatGPT-User',  allow: '/' },
      { userAgent: 'ClaudeBot',     allow: '/' },
      { userAgent: 'anthropic-ai',  allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot',         disallow: '/' },
      { userAgent: 'omgili',        disallow: '/' },
      { userAgent: 'omgilibot',     disallow: '/' },
    ],
    sitemap: 'https://secrethour.pk/sitemap.xml',
  };
}
