;(ls => {
  /* globals chrome $ */
  'use strict'

  const determineName = (item, suggest) => {
    let filename = item.filename
    ls.save_to_subdirectory &&
      ls.save_to_subdirectory !== '' &&
      (filename = `${ls.save_to_subdirectory}/${item.filename}`)
    suggest({ filename })
  }

  const traversePage = () => {
    chrome.downloads.onDeterminingFilename.addListener(determineName)
    chrome.windows.getCurrent(currentWindow =>
      chrome.tabs.query({ active: true, windowId: currentWindow.id }, activeTabs =>
        chrome.tabs.executeScript(activeTabs[0].id, { file: 'scripts/extractor.js', allFrames: true })
      )
    )
  }

  const filter = urls => {
    if (ls.url_filter_pattern && ls.url_filter_pattern !== '') {
      return urls.filter(url => new RegExp(ls.url_filter_pattern).test(url))
    }
    if (ls.css_selector_filter_pattern && ls.css_selector_filter_pattern !== '') {
      console.warn('Cannot do that. The session is different with the page.')
    }
    return urls
  }

  const download = urls => {
    const length = urls.length
    let counter = 0
    urls.forEach(url => {
      chrome.downloads.download({ url, conflictAction: 'uniquify' }, () => ++counter >= length && close())
    })
  }

  const downloadImages = () => {
    chrome.runtime.onMessage.addListener(result => {
      download(filter(result.urls))
    })
  }

  $(() => {
    traversePage()
    downloadImages()
  })
})(localStorage)
