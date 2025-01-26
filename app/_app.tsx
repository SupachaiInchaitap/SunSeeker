// filepath: /C:/Users/p/Desktop/SunSeeker/pages/_app.tsx
import '../styles/tailwind.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp