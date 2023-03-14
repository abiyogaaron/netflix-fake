import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import SectionCards from '@/components/card/section-cards';
import { getVideos } from '@/services/client';
import { IVideosData } from '@/interface';

import Banner from '@/components/banner';
import NavBar from '@/components/navbar';

import styles from '@/styles/pages/home.module.css';
import { verifyToken } from '@/utils/indext';
import { getWatchedVideos } from '@/services/graphql';

interface IServerSideProps {
  disneyVideos: IVideosData[];
  marvelVideos: IVideosData[];
  netflixVideos: IVideosData[];
  watchedVideos: IVideosData[];
}
export const getServerSideProps: GetServerSideProps<IServerSideProps> = async ({ res, req }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=604800, stale-while-revalidate=86400'
  );
  const token = req.cookies.token ? req.cookies.token : '';
  const userId = await verifyToken(token);

  if (!userId) {
    return {
      props: {
        disneyVideos: [],
        marvelVideos: [],
        netflixVideos: [],
      },
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const [
    disneyVideos,
    marvelVideos,
    netflixVideos,
    watchItAgainVideos,
  ] = await Promise.all([
    getVideos('disney official trailer', 'video'),
    getVideos('marvel official trailer', 'video'),
    getVideos('netflix official Trailer', 'video'),
    getWatchedVideos(token, userId),
  ]);
  const reformatWatchedVideos = watchItAgainVideos.map((video) => ({
    id: video.videoId,
    title: 'video title',
    imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
  }))

  return {
    props: {
      disneyVideos: disneyVideos,
      marvelVideos: marvelVideos,
      netflixVideos: netflixVideos,
      watchedVideos: reformatWatchedVideos,
    },
  }
}

const Home: NextPage<IServerSideProps> = ({
  disneyVideos,
  marvelVideos,
  netflixVideos,
  watchedVideos,
}) => {
  return (
    <>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="watch and stream your movies from home" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Banner
        videoId="4zH5iYM4wJo"
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
      />

      <div className={styles.sectionWrapper}>
        <SectionCards title='Watch it again' videos={watchedVideos} size="small" shouldScale={true} shouldWrap={false} />
        <SectionCards title='Marvel' videos={marvelVideos} size="small" shouldScale={true} shouldWrap={false} />
        <SectionCards title='Disney' videos={disneyVideos} size="small" shouldScale={true} shouldWrap={false} />
        <SectionCards title='For you' videos={netflixVideos} size="small" shouldScale={true} shouldWrap={false} />
      </div>
    </>
  )
}

export default Home;
