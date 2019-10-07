/* Remove loading screen */
export const lazyLoad = percentage => {
  const dom = document.querySelector('.lazyLoad')
  const text = document.querySelector('.lazyLoad__text')

  text.textContent = `${Math.floor(percentage)}%`

  Math.floor(percentage) === 100
    ? dom.remove()
    : null
}
