require('babel-polyfill');

function setDomain() {
  if (process.env.DOMAIN) return process.env.DOMAIN;
  if (process.env.HOST && process.env.PORT) return `http://${process.env.HOST}:${process.env.PORT}`;
  if (process.env.HOST) return `http://${process.env.HOST}`;
  if (process.env.PORT) return `http://localhost:${process.env.PORT}`;
  return 'http://localhost:8080';
}

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  proxy_off: process.env.PROXY_OFF === 'true',
  secure: process.env.SECURE === 'true',
  apiGamePort: process.env.APIGAMEPORT,
  apiPrefix: '/api/v2',
  apiUrl: `http://${process.env.APIHOST}:${process.env.APIPORT}`,
  apiTokenKey: 'x-access-token',
  tokenExpire: 14, // in days
  facebookAppId: `"${process.env.FBAPPID}"`,
  googleClientId: '1019156225300-b892bhdooe5nf2s535h0kabi39e05cpe.apps.googleusercontent.com',
  tumblrKey: 'epFkbS24QTYvgb2DRu2UtS5kCRcfPHqandDiiZbzlRDnQkP0b8',
  googleMapsKey: process.env.GOOGLEMAPSKEY,
  domain: setDomain(),
  app: {
    title: 'Viemate',
    //email: 'support@What-song.com',
    description: 'Meet and rent rooms from Boston roommates, at the perfect price in the best location. The biggest roommate and sublet community in Boston.',
    head: {
      htmlAttributes: {
        lang: 'en'
      },
      title: 'Viemate',
      meta: [
        { name: 'description', content: 'Meet and rent rooms from Boston roommates, at the perfect price in the best location. The biggest roommate and sublet community in Boston.' },
        { name: 'keywords', content: 'viemate, boston, sublet, room, apartment, roommate, find, rent, viemate.com' },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'Viemate' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'Viemate' },
        { property: 'og:description', content: 'Meet and rent rooms from Boston roommates, at the perfect price in the best location. The biggest roommate and sublet community in Boston.' },
      ]
    },
    notFound: {
      title: 'Viemate',
      meta: [
        { name: 'description', content: 'Meet and rent rooms from Boston roommates, at the perfect price in the best location. The biggest roommate and sublet community in Boston.' },
        { name: 'keywords', content: 'viemate, boston, sublet, room, apartment, roommate, find, rent, viemate.com' },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'Viemate' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'Viemate' },
        { property: 'og:description', content: 'Meet and rent rooms from Boston roommates, at the perfect price in the best location. The biggest roommate and sublet community in Boston.' },
      ]
    }
  }
}, environment);
