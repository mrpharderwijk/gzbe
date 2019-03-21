export default {
  version: process.env.API_VERSION,
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
  ],
};
