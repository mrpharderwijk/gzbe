export default {
  version: process.env.API_VERSION,
  feeds: {
    emergencies: {
      id: 'alarmeringen',
      link: 'https://www.alarmeringen.nl',
      logo: 'alarmeringen',
      name: 'alarmeringen.nl',
      serviceUrls: {
        type: 'RSS',
        url: 'https://www.alarmeringen.nl/feeds/region',
        regions: [
          {
            id: 'amsterdam-amstelland',
            name: 'Amsterdam Amstelland',
          },
          {
            id: 'brabant-noord',
            name: 'Brabant Noord',
          },
          {
            id: 'brabant-zuidoost',
            name: 'Brabant Zuidoost',
          },
          {
            id: 'drenthe',
            name: 'Drenthe',
          },
          {
            id: 'flevoland',
            name: 'Flevoland',
          },
          {
            id: 'friesland',
            name: 'Friesland',
          },
          {
            id: 'gelderland-midden',
            name: 'Gelderland Midden',
          },
          {
            id: 'gelderland-zuid',
            name: 'Gelderland-Zuid',
          },
          {
            id: 'gooi-en-vechtstreek',
            name: 'Gooi en Vechtstreek',
          },
          {
            id: 'groningen',
            name: 'Groningen',
          },
          {
            id: 'haaglanden',
            name: 'Haaglanden',
          },
          {
            id: 'hollands-midden',
            name: 'Hollands Midden',
          },
          {
            id: 'ijsselland',
            name: 'IJsselland',
          },
          {
            id: 'kennemerland',
            name: 'Kennemerland',
          },
          {
            id: 'limburg-noord',
            name: 'Limburg Noord',
          },
          {
            id: 'limburg-zuid',
            name: 'Limburg Zuid',
          },
          {
            id: 'midden-en-west-brabant',
            name: 'Midden- en West-Brabant',
          },
          {
            id: 'noord-en-oost-gelderland',
            name: 'Noord en Oost-Gelderland',
          },
          {
            id: 'noord-holland-noord',
            name: 'Noord-Holland Noord',
          },
          {
            id: 'rotterdam-rijnmond',
            name: 'Rotterdam-Rijnmond',
          },
          {
            id: 'twente',
            name: 'Twente',
          },
          {
            id: 'utrecht',
            name: 'Utrecht',
          },
          {
            id: 'zaanstreek-waterland',
            name: 'Zaanstreek-Waterland',
          },
          {
            id: 'zeeland',
            name: 'Zeeland',
          },
          {
            id: 'zuid-holland-zuid',
            name: 'Zuid-Holland Zuid',
          },
        ],
      },
    },
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
  },
};
