import { NextPage } from 'next';
import Link from 'next/link';
import clsx from "classnames";
import { IVideosData } from '@/interface';
import Card, { TSize } from '.';

import styles from "./section-cards.module.css";

interface ISectionCardsProps {
  title: string;
  videos: IVideosData[];
  size: TSize;
  shouldWrap: boolean;
  shouldScale: boolean;
}

const SectionCards: NextPage<ISectionCardsProps> = ({
  title,
  videos = [],
  size,
  shouldWrap = false,
  shouldScale,
}) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, idx) => {
          return (
            <Link key={video.id} href={`/video/${video.id}`}>
              <Card 
                id={idx} 
                imgUrl={video.imgUrl} 
                size={size}
                shouldScale={shouldScale}
              />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default SectionCards;