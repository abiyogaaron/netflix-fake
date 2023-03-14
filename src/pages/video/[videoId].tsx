import { 
  GetStaticPaths, 
  GetStaticProps, 
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from 'react-modal';
import clsx from "classnames";

import { getPopularVideos, getVideoDetails, getVideos, toggleLike } from "@/services/client";
import { IVideosDataDetail } from "@/interface";

import NavBar from "@/components/navbar";
import Like from "@/components/icons/likeIcon";
import DisLike from "@/components/icons/dislikeIcon";

import styles from '@/styles/pages/video.module.css';

interface IGetStaticProps {
  video: IVideosDataDetail | null;
}

export const getStaticProps: GetStaticProps<IGetStaticProps> =  async (context) => {
  const videoId = context.params?.videoId;
  console.log("context", context);
  console.log("getStaticProps: ", videoId);
  const videoDetails = await getVideoDetails(videoId as string);
  return {
    props: {
      video: videoDetails.length > 0 ? videoDetails[0] : null,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const [
    disneyVideos,
    marvelVideos,
    netflixVideos,
    popularVideos,
  ] = await Promise.all([
    getVideos('disney official trailer', 'video'),
    getVideos('marvel official trailer', 'video'),
    getVideos('netflix official Trailer', 'video'),
    getPopularVideos(),
  ]);

  const disneyPaths = disneyVideos.map((item) => {
    return {
      params: {
        videoId: item.id
      }
    }
  });
  const marvelPaths = marvelVideos.map((item) => {
    return {
      params: {
        videoId: item.id
      }
    }
  });
  const netflixPaths = netflixVideos.map((item) => {
    return {
      params: {
        videoId: item.id
      }
    }
  });
  const popularPaths = popularVideos.map((item) => {
    return {
      params: {
        videoId: item.id
      }
    }
  });

  return {
    paths: [
      ...disneyPaths,
      ...marvelPaths,
      ...netflixPaths,
      ...popularPaths,
    ],
    fallback: "blocking",
  }
}

type TLikeState = 'not-yet' | 'liked' | 'disliked';
const VideoDetail: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  video,
}) => {
  const router = useRouter();
  const [likeState, setLikeState] = useState<TLikeState>('not-yet');

  const handleToggleLike = async (state: Exclude<TLikeState, 'not-yet'>, favorite: number) => {
    if (likeState === state) {
      return;
    }

    setLikeState(state);
    if (video) {
      await toggleLike(video.id, favorite);
    }
  }
  
  return (
    <div>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
          frameBorder="0"
          className={styles.videoPlayer}
        />
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={() => handleToggleLike('liked', 1)}>
              <div className={styles.btnWrapper}>
                <Like selected={likeState === 'liked'} />
              </div>
            </button>
          </div>
          <button onClick={() => handleToggleLike('disliked', 0)}>
            <div className={styles.btnWrapper}>
              <DisLike selected={likeState === 'disliked'} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{video?.publishTime}</p>
              <p className={styles.title}>{video?.title}</p>
              <p className={styles.description}>{video?.description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{video?.channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{video?.statistics.viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default VideoDetail