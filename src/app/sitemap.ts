import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://secrethour.pk';
  const now  = new Date();

  return [
    { url: `${base}/`,                                   lastModified: now, changeFrequency: 'weekly',  priority: 1   },
    { url: `${base}/shop`,                               lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/product/the-midnight-deck`,          lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/product/bridal-box`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/product/intimate-night-set`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/product/midnight-glow-candle`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/product/silk-bond`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/quiz`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/about`,                              lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/testimonials`,                       lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${base}/contact`,                            lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/info/faq`,                           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/info/shipping`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/info/refund`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/info/returns`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/info/privacy`,                       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/info/terms`,                         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/info/referral`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
