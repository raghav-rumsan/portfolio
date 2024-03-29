import React from 'react';
import styled from 'styled-components';
import { GatsbyImage } from 'gatsby-plugin-image';
import SwiperCore, { EffectCoverflow, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './styles.css';

// import Swiper core and required modules

// install Swiper modules
SwiperCore.use([EffectCoverflow, Pagination, Scrollbar]);

const ImageGallery = ({ items }) => {
  const Image = styled(GatsbyImage)`
    border-radius: calc(var(--defaultRadius) * 2);
    /* margin: calc(var(--authorImgSize) / 2 * -1) 0 0 0; */
    margin-left: auto;
    margin-right: auto;

    & img {
      border-radius: calc(var(--defaultRadius) * 2);
    }

    @media screen and (max-width: 860px) {
      width: calc(100% + calc(var(--globalPaddingLr) * 2));
      /* height: 300px; */
      margin: calc(var(--authorImgSize) / 2 * -1) 0 0
        calc(var(--globalPaddingLr) * -1);
      border-radius: 0;
      & img {
        border-radius: 0;
      }
    }
  `;

  const ImageContainer = styled.div`
    border-radius: calc(var(--defaultRadius) * 2);
    background: #f8f8f8;
  `;

  const Caption = styled.div`
    padding: 5px;
    text-align: center;
    h2 {
      font-family: Comforter;
      font-weight: bold;
      font-size: x-large;
      color: var(--headingsColor);
    }
    .description {
      font-family: Source Code Pro;
      width: 95%;
    }
  `;

  const Tags = styled.div`
    box-sizing: border-box;
    margin: 0 8px 0 0;
    color: #000000d9;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    display: inline-block;
    height: auto;
    padding: 0 7px;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    background: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    opacity: 1;
    transition: all 0.3s;
    color: ${({ color }) => color};
    border-color: ${({ color }) => color};
    background: #f0f5ff;
    text-transform: capitalize;
  `;

  const TagsContainer = styled.div`
    position: absolute;
    top: 0.1rem;
    z-index: 1;
    left: 0.5rem;
  `;

  return (
    <div>
      <Swiper
        navigation
        scrollbar={{ draggable: true }}
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        className="mySwiper"
      >
        {items?.map((item) => (
          <SwiperSlide key={item.caption}>
            <ImageContainer>
              <TagsContainer>
                {item.src.smartTags?.map((tag) => (
                  <Tags color={item.src.colors[0].hex} key={tag}>
                    {tag}{' '}
                  </Tags>
                ))}
              </TagsContainer>
              <Image image={item.src.gallerySrcData} alt={item.src.srcAlt} />
              <Caption>
                <h2>{item.caption}</h2>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </Caption>
            </ImageContainer>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageGallery;
