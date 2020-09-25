;(ls => {
  /* globals $ */
  'use strict'

  const initializeOptions = options => {
    options = options || ls
    $('#save_to_subdirectory').val(options.save_to_subdirectory)
    $('#url_filter_pattern').val(options.url_filter_pattern)
    $('#css_selector_filter_pattern').val(options.css_selector_filter_pattern)
  }

  const initializeButtons = () => {
    $('#save_button').on('click', save)
    $('#reset_button').on('click', reset)
    $('#clear_data_button').on('click', clear)
  }

  const save = () => {
    ls.save_to_subdirectory = $('#save_to_subdirectory').val().trim()
    ls.url_filter_pattern = $('#url_filter_pattern').val().trim()
    ls.css_selector_filter_pattern = $('#css_selector_filter_pattern').val().trim()
  }

  const reset = () => {
    const options = JSON.parse(ls.options)
    const values = {}
    for (let i = 0; i < options.length; i++) {
      values[options[i]] = ls[`${options[i]}_default`]
    }
    initializeOptions(values)
  }

  const clear = () => {
    const result = window.confirm('Are you sure you want to clear all data for this extension?')
    if (result) {
      ls.clear()
      window.location.reload()
    }
  }

  $(() => {
    initializeOptions()
    initializeButtons()
  })
})(localStorage)
