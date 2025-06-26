const chapterModules = import.meta.glob('./chapter-files/*.md', { as: 'raw', eager: true })
const imageModules = import.meta.glob('./images/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
})

export interface Chapter {
  number: number
  slug: string
  title: string
  content: string
  image?: string
}

function extractNumber(fileName: string): number {
  const match = fileName.match(/Chapter[_\s-]*(\d+)/i)
  return match ? parseInt(match[1]) : 0
}

const chapters: Chapter[] = Object.entries(chapterModules).map(([path, content]) => {
  const fileName = path.split('/').pop() ?? ''
  const number = extractNumber(fileName)
  const slug = `chapter-${number}`
  const firstLine = (content as string).split('\n')[0]
  const title = firstLine.replace(/[*#]/g, '').trim()

  let image: string | undefined
  for (const [imgPath, url] of Object.entries(imageModules)) {
    const imgName = imgPath.split('/').pop() ?? ''
    if (extractNumber(imgName) === number) {
      image = url as string
      break
    }
  }

  return { number, slug, title, content: content as string, image }
}).sort((a, b) => a.number - b.number)

export default chapters
