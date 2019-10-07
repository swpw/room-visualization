/* Toggle Overlay Helper */
document.querySelector('.help').addEventListener('click', () => {
  document.querySelector('.shortcuts').classList.remove('shortcuts--hidden')
})

document.querySelector('.shortcuts__close').addEventListener('click', () => {
  document.querySelector('.shortcuts').classList.add('shortcuts--hidden')
})


/* Hide overlay */
document.body.addEventListener('keypress', (e) => {
  const ghSticker = document.querySelector('.github-corner')
  const help = document.querySelector('.help')

  ghSticker.classList.toggle('overlay-hidden')
  help.classList.toggle('overlay-hidden')
})
