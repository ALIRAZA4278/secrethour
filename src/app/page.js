import HomeClient from './HomeClient';
import { getHomeSettings } from '../lib/site-settings-server';

// Statically regenerated at most once a minute; saving in admin -> Site Content also
// revalidates this page on demand, so edits show straight away.
export const revalidate = 60;

export default async function HomePage() {
  const { hero, featured } = await getHomeSettings();
  return <HomeClient hero={hero} featuredSlug={featured.slug} />;
}
