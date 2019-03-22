import { Injectable, HttpService } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { Observable, from, forkJoin, EMPTY, of } from 'rxjs';
import * as Parser from 'rss-parser';
import { NosArticle } from '../shared/models/article/nos-article.model';
import { TextHelper } from '../shared/helpers/text.helper';
import { ConfigService } from 'nestjs-config';
import { Article } from '../shared/models/article/article.model';
import { ObjectHelper } from '../shared/helpers/object.helper';
import { ApiSource } from '../shared/models/api/api-source.model';
import { NuArticle } from '../shared/models/article/nu-article.model';
import { NewsApiArticle } from '../shared/models/article/news-api-article.model';
import { stringLiteral } from '@babel/types';
import { GsArticle } from '../shared/models/article/geenstijl-article.model';
import { TweakersArticle } from '../shared/models/article/tweakers-article.model';

@Injectable()
export class SourceService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  /**
   * Retrieves all general news headlines from all news sources
   * @param categoryName
   */
  findAllHeadlines(sourceId: string = 'all'): Observable<Article[]> {
    let observableStream = of([]);

    const sourceFound = this.configService
      .get('api')
      .sources.find((source: ApiSource) => source.id === sourceId);

    /**
     * Create observableStream with all sources
     */
    if (!sourceFound && sourceId === 'all') {
      observableStream = this.configService
        .get('api')
        .sources.map((source: ApiSource) => {
          return this.retrieveArticles(source.id);
        });
    }

    /**
     * Create observableStream with only the found source
     */
    if (sourceFound && sourceId !== 'all') {
      observableStream = this.retrieveArticles(sourceFound.id);
    }

    const response = forkJoin(
      observableStream,
      // this.retrieveArticles('tweakers', categoryName),
      // merges all the results in one array
      (...results: any[]) =>
        results.reduce((acc, currResponse) => {
          return currResponse ? acc.concat(currResponse) : acc;
        }, []),
    );

    return response;
  }

  /**
   * Retrieves all news sources
   */
  findAllSources(): ApiSource[] {
    return this.configService.get('api').sources;
  }

  /**
   * Retrieves the articles of a given news source by name and category
   * @param name
   * @param category
   */
  private retrieveArticles(
    id: string,
    category: string = 'general',
  ): Observable<Article[]> {
    const apiSource = this.configService
      .get('api')
      .sources.find((source: ApiSource) => source.id === id);

    const type = apiSource.serviceUrls.type;
    const url = ObjectHelper.hasPath(apiSource, `serviceUrls.${category}`)
      ? apiSource.serviceUrls[category]
      : null;

    if (!url) {
      return of([]);
    }

    /**
     * RSS feed calls
     */
    if (type === 'RSS') {
      const parser = new Parser();
      const feed = parser.parseURL(url);

      // Transform feed promise to observable and map the articles to GZ article model
      return from(feed).pipe(
        map(feedResponse => {
          switch (id) {
            case 'nos':
              return this.nosMapper(apiSource, feedResponse.items);
            case 'nu-nl':
              return this.nuNlMapper(apiSource, feedResponse.items);
            case 'geenstijl':
              return this.geenStijlMapper(apiSource, feedResponse.items);
            case 'tweakers':
              return this.tweakersMapper(apiSource, feedResponse.items);
          }
        }),
      );
    }

    /**
     * API calls
     */
    if (type === 'API') {
      return this.httpService.get(url).pipe(
        catchError(error => {
          console.error(error);
          return EMPTY;
        }),
        map(apiResponse => {
          return this.rtlNieuwsMapper(apiSource, apiResponse.data.articles);
        }),
      );
    }
  }

  /**
   * Maps the NOS RSS articles to the GZ article
   * @param apiSource
   * @param nosArticles
   */
  private nosMapper(
    apiSource: ApiSource,
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
  private nuNlMapper(apiSource: ApiSource, nuArticles: NuArticle[]): Article[] {
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
  private rtlNieuwsMapper(
    apiSource: ApiSource,
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
  private geenStijlMapper(apiSource: ApiSource, gsArticles: GsArticle[]) {
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

  private tweakersMapper(apiSource: ApiSource, twArticles: TweakersArticle[]) {
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
}
