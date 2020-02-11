const Domain = 'https://wastim-yufroms.web.app'
export default {
  head () {
    return {
      __dangerouslyDisableSanitizers: ['script'],
      script: [{
        innerHTML: `{
          "@context": "http://schema.org",
          "@type": "Person",
          "name": "Yuichi Ishiyama",
          "url": "${Domain + this.meta.url}",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${Domain}/"
          },
          "description": "${this.meta.description}"
        }`,
        type: 'application/ld+json'
      }],
      htmlAttrs: {
        lang: this.meta.lang
      },
      title: this.meta.title,
      meta: [
        { hid: 'description', name: 'description', content: this.meta.description },
        { hid: 'og:type', property: 'og:type', content: this.meta.type },
        { hid: 'og:title', property: 'og:title', content: this.meta.title },
        { hid: 'og:description', property: 'og:description', content: this.meta.description },
        { hid: 'og:url', property: 'og:url', content: Domain + this.meta.url.replace(/\/$/, '') },
        { hid: 'og:image', property: 'og:image', content: Domain + '/' + this.meta.image }
      ],
      link: [
        { rel: 'canonical', href: Domain + this.meta.url.replace(/\/$/, '') }
      ],
      bodyAttrs: {
        class: (this.meta.bodyClass ? this.meta.bodyClass : 'base')
      }
    }
  }
}
