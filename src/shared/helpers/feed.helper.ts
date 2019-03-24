import { NewsSource } from '../models/api/news/news-source.model';
import { NosArticle } from '../models/article/nos-article.model';
import { Article } from '../models/article/article.model';
import { TextHelper } from './text.helper';
import { ObjectHelper } from './object.helper';
import { NuArticle } from '../models/article/nu-article.model';
import { NewsApiArticle } from '../models/article/news-api-article.model';
import { GsArticle } from '../models/article/geenstijl-article.model';
import { AlarmeringenArticle } from '../models/article/alarmeringen-article.model';
import { TweakersArticle } from '../models/article/tweakers-article.model';
import { EmergenciesFeed } from '../models/api/emergencies/emergencies-feed.model';

// Do not move or remove the @dynamic comment!
// @dynamic
export class FeedHelper {
  /**
   * Maps the NOS RSS articles to the GZ article
   * @param apiSource
   * @param nosArticles
   */
  static nosMapper(
    apiSource: NewsSource,
    nosArticles: NosArticle[],
  ): Article[] {
    return nosArticles.map((item: NosArticle) => ({
      source: {
        id: apiSource.id,
        name: apiSource.name,
        logo: apiSource.logo,
      },
      author: 'nos',
      categories: [],
      // TODO: textHelper...
      content: item.content,
      contentSnippet: TextHelper.truncate(
        item.contentSnippet.replace(/<\/?[^>]+(>|$)/g, ''),
        40,
        true,
      ),
      image: {
        type: ObjectHelper.hasPath(item, 'enclosure.type')
          ? item.enclosure.type
          : null,
        url: ObjectHelper.hasPath(item, 'enclosure.url')
          ? item.enclosure.url
          : null,
        rights: 'Copyright: NOS.nl',
      },
      isoDate: item.isoDate,
      link: item.link,
      title: item.title,
    }));
  }

  /**
   * Maps the Nu.nl RSS articles to the GZ article
   * @param apiSource
   * @param nuArticles
   */
  static nuNlMapper(apiSource: NewsSource, nuArticles: NuArticle[]): Article[] {
    return nuArticles.map(item => ({
      source: {
        id: apiSource.id,
        name: apiSource.name,
        logo: apiSource.logo,
      },
      author: item.creator,
      categories: item.categories,
      content: item.content,
      contentSnippet: item.content,
      image: {
        type: ObjectHelper.hasPath(item, 'enclosure.type')
          ? item.enclosure.type
          : null,
        url: ObjectHelper.hasPath(item, 'enclosure.url')
          ? item.enclosure.url
          : null,
        rights: item.rights,
      },
      isoDate: item.isoDate,
      link: item.link,
      title: item.title,
    }));
  }

  /**
   * Maps the RTL nieuws api articles to the GZ article
   * @param apiSource
   * @param rtlArticles
   */
  static rtlNieuwsMapper(
    apiSource: NewsSource,
    rtlArticles: NewsApiArticle[],
  ): Article[] {
    return rtlArticles.map(item => ({
      source: {
        id: apiSource.id,
        name: apiSource.name,
        logo: apiSource.logo,
      },
      author: item.author,
      categories: [],
      content: item.description,
      contentSnippet: item.description,
      image: {
        type: null,
        url: item.urlToImage,
        rights: null,
      },
      isoDate: item.publishedAt,
      link: item.url,
      title: item.title,
    }));
  }

  /**
   * Maps the GeenStijl RSS articles to the GZ article
   * @param apiSource
   * @param gsArticles
   */
  static geenStijlMapper(apiSource: NewsSource, gsArticles: GsArticle[]) {
    return gsArticles.map(item => ({
      source: {
        id: apiSource.id,
        name: apiSource.name,
        logo: apiSource.logo,
      },
      author: item.author,
      categories: [],
      content: item.content,
      contentSnippet: item.contentSnippet,
      image: {
        type: null,
        url: null,
        rights: null,
      },
      isoDate: item.isoDate,
      link: item.link,
      title: item.title,
    }));
  }

  /**
   * Maps the Tweakers RSS articles to the GZ article
   * @param apiSource
   * @param gsArticles
   */
  static tweakersMapper(apiSource: NewsSource, twArticles: TweakersArticle[]) {
    return twArticles.map(item => ({
      source: {
        id: apiSource.id,
        name: apiSource.name,
        logo: apiSource.logo,
      },
      author: item.author,
      categories: item.categories,
      content: item.content,
      contentSnippet: item.contentSnippet,
      image: {
        type: null,
        url: null,
        rights: null,
      },
      isoDate: item.isoDate,
      link: item.link,
      title: item.title,
    }));
  }

  static alarmeringenMapper(
    apiSource: EmergenciesFeed,
    alArticles: AlarmeringenArticle[],
  ) {
    return alArticles.map(item => ({
      source: {
        id: apiSource.id,
        name: apiSource.name,
        logo: this.getEmergencyLogo(item.content),
      },
      content: item.content,
      contentSnippet: item.contentSnippet,
      isoDate: item.isoDate,
      link: item.link,
      title: item.title,
    }));
  }

  static getEmergencyLogo(content: string) {
    if (!content) {
      return 'emergency';
    }

    const searchString = content.toLowerCase();

    if (searchString.includes('politie')) {
      return 'police';
    }

    if (searchString.includes('ambulance')) {
      return 'ambulance';
    }
    if (searchString.includes('brand')) {
      return 'fire-brigade';
    }
  }
}
