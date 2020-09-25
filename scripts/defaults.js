;(ls => {
  'use strict'

  chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
      chrome.tabs.create({ url: 'views/options.html' })
    } else if (details.reason === 'update' && /^(((0|1)\..*)|(2\.(0|1)(\..*)?))$/.test(details.previousVersion)) {
      console.info('Upgrade version.')
      ls.clear()
    }
  })

  const defaults = {
    url_filter_pattern: '^.*$',
    css_selector_filter_pattern: '',
    save_to_subdirectory: '',
  }

  for (let option in defaults) {
    if (ls[option] === undefined) ls[option] = defaults[option]
    ls[`${option}_default`] = defaults[option]
  }

  ls.animation_duration = '500'
  ls.options = JSON.stringify(Object.keys(defaults))
})(localStorage)
