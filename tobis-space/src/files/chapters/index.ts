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

const chapters: Chapter[] = Object.entries(chapterModules)
  .map(([path, content]) => {
    const fileName = path.split("/").pop() ?? ""
    const number = extractNumber(fileName)
    const slug = `chapter-${number}`
    const lines = (content as string).split("\n")
    const body = lines.slice(1).join("\n").trim()
    const title = `Chapter ${number}`

    let image: string | undefined
    for (const [imgPath, url] of Object.entries(imageModules)) {
      const imgName = imgPath.split("/").pop() ?? ""
      if (extractNumber(imgName) === number) {
        image = url as string
        break
      }
    }

    return { number, slug, title, content: body, image }
  })
  .sort((a, b) => a.number - b.number)

// Filter out duplicate chapters by slug (based on chapter number)
const uniqueChapters: Chapter[] = []
for (const ch of chapters) {
  if (!uniqueChapters.some((u) => u.slug === ch.slug)) {
    uniqueChapters.push(ch)
  }
}

export default uniqueChapters
