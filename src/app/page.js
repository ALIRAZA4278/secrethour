import HomeClient from './HomeClient';
import { getHeroSettings } from '../lib/site-settings-server';

// Statically regenerated at most once a minute; saving the hero in admin also
// revalidates this page on demand, so edits show straight away.
export const revalidate = 60;

export default async function HomePage() {
  const hero = await getHeroSettings();
  return <HomeClient hero={hero} />;
}
