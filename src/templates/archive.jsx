import React from 'react';
import { graphql } from 'gatsby';
import PageWrapper from '../components/layout/pageWrapper';
import Hero from '../components/layout/hero';
import useLanguages from '../hooks/useLanguages';
import {
  SectionContainerGridThreeCols,
  SectionWrapper,
} from '../components/layout/sectionStyles';
import ArticleCard, { CardImgArtDir } from '../components/ui/articleCard';
import {
  ArchiveNav,
  ArchiveList,
  ArchiveListLink,
} from '../components/ui/archivePagination';

const BlogArchiveTemplate = ({
  data: {
    datoCmsArchivePage: {
      hero: [{ heroTitle, heroSubtitle, heroAlt }],
      seo: { seoTitle, seoDescription },
      siderImage,
    },
    allDatoCmsBlogPost: { blogPostNodes },
    datoCmsWebsiteSetting: { minsReadSuffix },
  },
  pageContext,
}) => {
  const { defaultLanguage, blogPath } = useLanguages();
  const { pagesNumber, archivePageNumber, locale } = pageContext;

  return (
    <PageWrapper
      pageData={pageContext}
      seoTitle={seoTitle}
      seoDescription={seoDescription}
    >
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        alt={heroAlt}
        siderImage={siderImage[0]}
      />
      <SectionWrapper isBlog>
        <SectionContainerGridThreeCols>
          {blogPostNodes.map(
            ({
              id,
              meta: { firstPublishedAt },
              minutesOfReading,
              cardImage,
              title,
              subtitle,
              // author,
              category,
              slug,
            }) => (
              <ArticleCard
                article
                key={id}
                category={category}
                time={`${minutesOfReading} ${minsReadSuffix}`}
                cardImg={
                  cardImage &&
                  CardImgArtDir(
                    cardImage.gatsbyImageData,
                    cardImage.squaredImage,
                    cardImage.alt
                  )
                }
                title={title}
                excerpt={subtitle}
                // authorImg={author?.picture.gatsbyImageData}
                // authorAltImg={author?.picture.alt}
                // authorName={author?.name}
                slug={slug}
              />
            )
          )}
        </SectionContainerGridThreeCols>
        <ArchiveNav>
          <ArchiveList>
            {Array.from({ length: pagesNumber }, (_, index) => (
              <li key={`page_number${index + 1}`}>
                <ArchiveListLink
                  as={index === archivePageNumber - 1 ? 'span' : ''}
                  to={
                    locale === defaultLanguage &&
                    index !== archivePageNumber - 1
                      ? `/${blogPath}/${index === 0 ? '' : index + 1}`
                      : locale !== defaultLanguage &&
                        index !== archivePageNumber - 1
                      ? `/${locale}/${blogPath}/${index === 0 ? '' : index + 1}`
                      : '/'
                  }
                >
                  {index + 1}
                </ArchiveListLink>
              </li>
            ))}
          </ArchiveList>
        </ArchiveNav>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default BlogArchiveTemplate;

// Main query

export const query = graphql`
  query BlogArchiveQuery($locale: String!, $skip: Int!, $limit: Int!) {
    datoCmsArchivePage(locale: { eq: $locale }) {
      locale
      seo {
        seoTitle: title
        seoDescription: description
      }

      hero {
        heroTitle
        heroSubtitle
        heroAlt
      }
      siderImage {
        alt
        url
      }
    }
    allDatoCmsBlogPost(
      sort: { order: DESC, fields: meta___firstPublishedAt }
      filter: { locale: { eq: $locale } }
      limit: $limit
      skip: $skip
    ) {
      blogPostNodes: nodes {
        id: originalId
        meta {
          firstPublishedAt(locale: $locale, formatString: "DD MMM YYYY")
        }
        minutesOfReading
        category
        cardImage {
          gatsbyImageData(
            width: 280
            height: 100
            placeholder: NONE
            forceBlurhash: false
          )
          squaredImage: gatsbyImageData(
            width: 100
            height: 100
            imgixParams: { ar: "1", fit: "crop" }
          )
          alt
        }

        subtitle
        title
        slug
        reference
      }
    }

    datoCmsWebsiteSetting(locale: { eq: $locale }) {
      minsReadSuffix
    }
  }
`;
