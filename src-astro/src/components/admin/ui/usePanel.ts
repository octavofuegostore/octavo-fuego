export function initPanel(panelName: string): { abrir: () => void; cerrar: () => void } {
  const abrir = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('panel', panelName)
    window.history.pushState({ panel: panelName }, '', url.toString())
    document.getElementById(`panel-${panelName}`)?.classList.remove('translate-x-full')
    document.getElementById(`panel-${panelName}-backdrop`)?.classList.remove('opacity-0', 'pointer-events-none')
  }

  const cerrar = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('panel')
    window.history.pushState({ panel: null }, '', url.toString())
    document.getElementById(`panel-${panelName}`)?.classList.add('translate-x-full')
    document.getElementById(`panel-${panelName}-backdrop`)?.classList.add('opacity-0', 'pointer-events-none')
  }

  // Open on load if URL has ?panel=
  if (typeof window !== 'undefined') {
    const params = new URL(window.location.href).searchParams
    if (params.get('panel') === panelName) {
      setTimeout(abrir, 0) // wait for DOM
    }

    // Browser navigation: back closes, forward re-opens
    window.addEventListener('popstate', () => {
      if (!new URL(window.location.href).searchParams.has('panel')) {
        ocultarPanel()
      } else {
        mostrarPanel()
      }
    })
  }

  return { abrir, cerrar }
}
