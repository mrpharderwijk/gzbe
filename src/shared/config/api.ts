export default {
  version: process.env.API_VERSION,
  feeds: {
    news: {
      sources: [
        {
          id: 'nos',
          link: 'https://www.nos.nl',
          logo: 'nos',
          name: 'nos',
          serviceUrls: {
            type: 'RSS',
            general: 'http://feeds.nos.nl/nosnieuwsalgemeen',
            sport: 'http://feeds.nos.nl/nossportalgemeen',
          },
        },
        {
          id: 'nu-nl',
          link: 'https://www.nu.nl',
          logo: 'nu-nl',
          name: 'nu.nl',
          serviceUrls: {
            type: 'RSS',
            general: 'https://www.nu.nl/rss/Algemeen',
            sport: 'http://www.nu.nl/rss/Sport',
          },
        },
        {
          id: 'rtl-nieuws',
          link: 'https://www.rtlnieuws.nl',
          logo: 'rtl-nieuws',
          name: 'rtl nieuws',
          serviceUrls: {
            type: 'API',
            general: `https://newsapi.org/v2/top-headlines?sources=rtl-nieuws&apiKey=${
              process.env.NEWS_API_KEY
            }`,
          },
        },
        {
          id: 'geenstijl',
          link: 'https://www.geenstijl.nl',
          logo: 'geenstijl',
          name: 'geenstijl',
          serviceUrls: {
            type: 'RSS',
            general: 'https://www.geenstijl.nl/feeds/recent.atom',
          },
        },
        {
          id: 'tweakers',
          link: 'https://www.tweakers.net',
          logo: 'tweakers',
          name: 'tweakers',
          serviceUrls: {
            type: 'RSS',
            general: 'http://feeds.feedburner.com/tweakers/nieuws',
          },
        },
      ],
    },
    emergencies: {
      sources: [
        {
          id: 'alarmeringen',
          link: 'https://www.alarmeringen.nl',
          logo: 'alarmeringen',
          name: 'alarmeringen.nl',
          serviceUrls: {
            type: 'RSS',
            general:
              'https://www.alarmeringen.nl/feeds/region/gooi-en-vechtstreek.rss',
            amsterdamAmstelland:
              'https://www.alarmeringen.nl/feeds/region/amsterdam-amstelland.rss',
            brabantNoord:
              'https://www.alarmeringen.nl/feeds/region/brabant-noord.rss',
            brabantZuidOost:
              'https://www.alarmeringen.nl/feeds/region/brabant-zuidoost.rss',
          },
        },
      ],
    },
  },
};
