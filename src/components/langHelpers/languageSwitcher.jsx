import React, { useContext } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import styled from 'styled-components';
import { LangContext } from '../../context/langProvider';
import useLanguages from '../../hooks/useLanguages';
import { storeLocale, getLangCode } from '../../utils/misc';

// Scoped styles

const LangNavList = styled.ul`
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  column-gap: var(--gapRegular);

  & li span {
    cursor: not-allowed;

    &:hover {
      color: var(--disabledColor);
    }
  }

  .activeClassLangNav {
    color: var(--primaryColor);
    &:hover {
      color: var(--primaryColor);
    }
  }

  @media screen and (max-width: 767px) {
    column-gap: 0;
  }
`;

const LangNav = styled.nav`
  text-transform: uppercase;
  &&& {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

const LanguageSwitcherLink = styled(Link)`
  font-weight: 600;
  color: var(--disabledColor);
  transition: color 0.2s linear;

  &:hover {
    color: var(--primaryColor);
  }

  @media screen and (max-width: 767px) {
    padding: var(--gapSmall);
  }
`;

// Main Component

const LanguageSwitcher = () => {
  const data = useStaticQuery(graphql`
    query {
      allDatoCmsSite {
        siteNodes: nodes {
          locale
        }
      }
      allSitePage {
        pagesNodes: nodes {
          pageContext
        }
      }
    }
  `);

  const { defaultLanguage, blogPath, projectPath } = useLanguages();
  const {
    currentLanguage,
    pageType,
    slug: pageSlug,
    archivePageNumber,
    projectPageNumber,
  } = useContext(LangContext);

  const {
    allDatoCmsSite: { siteNodes },
    allSitePage: { pagesNodes },
  } = data;

  // Helpers

  const isHome = pageType === 'isHome';
  const isPage = pageType === 'isPage';
  const isArchiveRoot = pageType === 'isArchiveRoot';
  const isPaginatedArchive = pageType === 'isPaginatedArchive';
  const isPost = pageType === 'isPost';
  const isProject = pageType === 'isProject';
  const isProjectArchiveRoot = pageType === 'isProjectArchiveRoot';
  const isProjectPaginatedArchive = pageType === 'isProjectPaginatedArchive';

  return (
    <LangNav>
      {isHome ? (
        <LangNavList>
          {siteNodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLanguage && 'activeClassLangNav'}
                as={locale === currentLanguage && 'span'}
                to={locale === defaultLanguage ? '/' : `/${locale}`}
                onClick={() => storeLocale(locale)}
              >
                {getLangCode(locale)}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : isArchiveRoot ? (
        <LangNavList>
          {siteNodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLanguage && 'activeClassLangNav'}
                as={locale === currentLanguage && 'span'}
                to={
                  locale === defaultLanguage
                    ? `/${blogPath}`
                    : `/${locale}/${blogPath}`
                }
                onClick={() => storeLocale(locale)}
              >
                {getLangCode(locale)}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : isPaginatedArchive ? (
        <LangNavList>
          {siteNodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLanguage && 'activeClassLangNav'}
                as={locale === currentLanguage && 'span'}
                to={
                  locale === defaultLanguage
                    ? `/${blogPath}/${archivePageNumber}`
                    : `/${locale}/${blogPath}/${archivePageNumber}`
                }
                onClick={() => storeLocale(locale)}
              >
                {getLangCode(locale)}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : isProjectArchiveRoot ? (
        <LangNavList>
          {siteNodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLanguage && 'activeClassLangNav'}
                as={locale === currentLanguage && 'span'}
                to={
                  locale === defaultLanguage
                    ? `/${projectPath}`
                    : `/${locale}/${projectPath}`
                }
                onClick={() => storeLocale(locale)}
              >
                {getLangCode(locale)}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : isProjectPaginatedArchive ? (
        <LangNavList>
          {siteNodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLanguage && 'activeClassLangNav'}
                as={locale === currentLanguage && 'span'}
                to={
                  locale === defaultLanguage
                    ? `/${projectPath}/${projectPageNumber}`
                    : `/${locale}/${projectPath}/${projectPageNumber}`
                }
                onClick={() => storeLocale(locale)}
              >
                {getLangCode(locale)}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : (
        (isPost || isPage || isProject) && (
          <LangNavList>
            {siteNodes.map(({ locale }) =>
              /**
               * Iterate through all available languages..
               */

              locale === currentLanguage ? (
                /**
                 * Disable the anchor tag if rendering the link for the same locale of the page
                 */
                <li key={locale}>
                  <LanguageSwitcherLink
                    as="span"
                    className="activeClassLangNav"
                  >
                    {getLangCode(locale)}
                  </LanguageSwitcherLink>
                </li>
              ) : (
                /**
                 * Else, iterate through all the pages generated by gatsby-node.js and check...
                 */

                pagesNodes.map(
                  ({
                    pageContext: {
                      locale: contextLocale,
                      slug: contextSlug,
                      reference: contextReference,
                    },
                  }) =>
                    /**
                     * Is there a page with the same slug of the page I'm rendering the component into
                     * Which has the same locale of the page that I'm rendering the link into?
                     */

                    contextSlug === pageSlug &&
                    contextLocale === currentLanguage &&
                    /**
                     * The above condition will occur only once ensuring no duplicated
                     * languages links are rendered inside the switcher when a page has
                     *  the same slug for different languages
                     *
                     * Then, iterate again through all the pages...
                     */

                    pagesNodes.map(
                      ({
                        pageContext: {
                          locale: matchLocale,
                          slug: matchSlug,
                          reference: matchReference,
                        },
                      }) =>
                        /**
                         * Is there a page of the same locale I am rendering the link
                         * which has the same reference of the page found before?
                         */

                        matchLocale === locale &&
                        matchReference === contextReference && (
                          <li key={locale}>
                            <LanguageSwitcherLink
                              to={
                                isPost
                                  ? locale === defaultLanguage
                                    ? `/${blogPath}/${matchSlug}`
                                    : `/${locale}/${blogPath}/${matchSlug}`
                                  : isPage
                                  ? locale === defaultLanguage
                                    ? `/${matchSlug}`
                                    : `/${locale}/${matchSlug}`
                                  : isProject
                                  ? locale === defaultLanguage
                                    ? `/${projectPath}/${matchSlug}`
                                    : `/${locale}/${projectPath}/${matchSlug}`
                                  : '/'
                              }
                              onClick={() => storeLocale(locale)}
                            >
                              {getLangCode(locale)}
                            </LanguageSwitcherLink>
                          </li>
                        )
                    )
                )
              )
            )}
          </LangNavList>
        )
      )}
    </LangNav>
  );
};

export default LanguageSwitcher;
