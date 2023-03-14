import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { IVideosData } from "@/interface";
import { verifyToken } from "@/utils/indext";

import SectionCards from "@/components/card/section-cards";
import NavBar from "@/components/navbar";

import styles from '@/styles/pages/mylist.module.css';
import { getMyListVideos } from "@/services/graphql";

interface IServerSideProps {
  myListVideo: IVideosData[];
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=604800, stale-while-revalidate=86400'
  );
  const token = req.cookies.token ? req.cookies.token : '';
  const userId = await verifyToken(token);

  if (!userId) {
    return {
      props: {
        myListVideo: [],
      },
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const myListVideo = await getMyListVideos(token, userId);
  const reformatMyList = myListVideo.map((video) => ({
    id: video.videoId,
    title: 'my video',
    imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
  }));

  return {
    props: {
      myListVideo: reformatMyList,
    }
  }
}

const MyList: NextPage<IServerSideProps> = ({
  myListVideo,
}) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards 
            title="My List" 
            videos={myListVideo} 
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  )
};

export default MyList;