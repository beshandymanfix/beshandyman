import CityClient from './CityClient';

// This allows the page to be exported statically by telling Next.js which cities to pre-build.
export function generateStaticParams() {
  return [
    { cityName: 'San Antonio' },
    { cityName: 'Austin' },
    { cityName: 'New Braunfels' },
    { cityName: 'Kyle' },
    { cityName: 'Buda' },
    { cityName: 'San Marcos' }
  ];
}

export default function CityHome() {
  return <CityClient />;
}
