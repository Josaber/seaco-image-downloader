;(ls => {
  /* globals chrome */
  'use strict'

  const extractor = {
    fromTags: () => {
      const selector = ls.css_selector_filter_pattern || 'img, a, [style]'
      return [].slice.apply(document.querySelectorAll(selector)).map(extractor.fromElement)
    },

    fromStyles: () => {
      let urls = []
      for (let i = 0; i < document.styleSheets.length; i++) {
        const styleSheet = document.styleSheets[i]
        if (styleSheet.hasOwnProperty('cssRules')) {
          styleSheet.cssRules.forEach(rule => {
            if (rule.style && rule.style.backgroundImage) {
              const url = extractor.toBackgroundURL(rule.style.backgroundImage)
              if (extractor.isImage(url)) {
                urls.push({ url, link: false })
              }
            }
          })
        }
      }
      return urls
    },

    fromElement: element => {
      if (element.tagName.toLowerCase() === 'img') {
        let src = element.src
        const hashIndex = src.indexOf('#')
        if (hashIndex >= 0) src = src.substr(0, hashIndex)
        return { url: src, link: false }
      }

      if (element.tagName.toLowerCase() === 'a') {
        const href = element.href
        if (extractor.isImage(href)) return { url: href, link: true }
        return null
      }

      const style = window.getComputedStyle(element).backgroundImage
      if (style) {
        const url = extractor.toBackgroundURL(style)
        if (extractor.isImage(url)) {
          return { url, link: false }
        }
      }

      return null
    },

    isImage: url => {
      const regex = /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:bmp|gif|jpe?g|png|svg|webp))(?:\?([^#]*))?(?:#(.*))?/i
      return url.indexOf('data:image') === 0 || regex.test(url)
    },

    toBackgroundURL: style => {
      return style.replace(/^url\(["']?/, '').replace(/["']?\)$/, '')
    },

    toAbsoluteURL: url => {
      return url.indexOf('/') === 0 ? `${window.location.origin}${url}` : url
    },

    sanitize: urlObjects => {
      let result = []
      urlObjects.forEach(urlObject => {
        if (urlObject && !result.includes(urlObject.url)) result.push(urlObject.url)
      })
      return result
    },
  }

  const urls = extractor.sanitize([].concat(extractor.fromTags(), extractor.fromStyles())).map(extractor.toAbsoluteURL)
  console.info(urls)
  chrome.runtime.sendMessage({ urls })
})(localStorage)
