let webpSupport: Promise<boolean> | null = null

function detectWebpSupport(): Promise<boolean> {
  if (!webpSupport) {
    webpSupport = (async () => {
      try {
        const webpData =
          'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA='
        const blob = await fetch(webpData).then(r => r.blob())
        return await createImageBitmap(blob).then(
          () => true,
          () => false
        )
      }
      catch {
        return false
      }
    })()
  }
  return webpSupport
}

export function useWebpBackground(path: string) {
  const url = ref(path)

  onMounted(async () => {
    if (await detectWebpSupport()) {
      url.value = path.replace(/\.\w{1,5}$/, '.webp')
    }
  })

  return url
}