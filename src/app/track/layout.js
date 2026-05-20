export const metadata = {
  title: 'Track Your Order',
  description: 'Track your Secret Hour order status in real time using your PostEx tracking number or Order ID.',
  openGraph: {
    title: 'Track Your Order — Secret Hour',
    description: 'Check the live status of your Secret Hour delivery.',
    url: 'https://secrethour.pk/track',
  },
  alternates: { canonical: 'https://secrethour.pk/track' },
  robots: { index: false },
};

export default function TrackLayout({ children }) {
  return children;
}
