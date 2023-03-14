import { NextPage } from "next";
import Image from "next/image";
import { useMemo, useState } from "react";

import { DEFAULT_IMAGE } from "@/constants";

import cls from "classnames";
import { motion } from "framer-motion";

import styles from "./card.module.css";

export type TSize = 'large' | 'medium' | 'small';
interface ICardProps {
  imgUrl: string;
  size: TSize;
  id: number;
  shouldScale: boolean;
}

const Card: NextPage<ICardProps> = ({ 
  imgUrl = DEFAULT_IMAGE, 
  size = 'medium',
  id,
  shouldScale = true,
}) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);
  const classMap: Record<TSize, string> = useMemo(() => {
    return {
      large: styles.lgItem,
      medium: styles.mdItem,
      small: styles.smItem,
    }
  }, []);
  const scaleObj = useMemo(() => {
    return id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  }, []);
  const shouldHover = useMemo(() => {
    return shouldScale && { whileHover: { ...scaleObj }};
  }, []);

  const handleOnError = () => {
    setImgSrc(DEFAULT_IMAGE);
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        { ...shouldHover }
      >
        <Image
          src={imgSrc}
          alt="image"
          fill={true}
          onError={handleOnError}
          className={styles.cardImg}
        />
      </motion.div>
    </div>
  )
};

export default Card;