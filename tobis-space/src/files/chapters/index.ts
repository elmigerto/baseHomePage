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

function extractTitle(
  lines: string[],
  fileName: string,
  number: number,
): { title: string; bodyStart: number } {
  const firstIndex = lines.findIndex((l) => l.trim() !== "")
  const firstLine = firstIndex >= 0 ? lines[firstIndex] : ""
  const cleaned = firstLine
    .replace(/^#+\s*/, "")
    .replace(/\*\*/g, "")
    .trim()
  const match = cleaned.match(/chapter\s*\d+\s*[:-]\s*(.+)/i)
  if (match) {
    return { title: `Chapter ${number}: ${match[1].trim()}`, bodyStart: firstIndex + 1 }
  }
  const nameMatch = fileName.match(/Chapter[_\s-]*\d+(.*)\.md/i)
  if (nameMatch) {
    const rest = nameMatch[1]
      .replace(/[-_]+/g, " ")
      .replace(/\*+/g, "")
      .trim()
    if (rest) {
      return { title: `Chapter ${number}: ${rest}`, bodyStart: firstIndex + 1 }
    }
  }
  return { title: cleaned || `Chapter ${number}`, bodyStart: firstIndex + 1 }
}

const chapters: Chapter[] = Object.entries(chapterModules)
  .map(([path, content]) => {
    const fileName = path.split("/").pop() ?? ""
    const number = extractNumber(fileName)
    const slug = `chapter-${number}`
    const lines = (content as string).split("\n")
    const { title, bodyStart } = extractTitle(lines, fileName, number)
    const body = lines.slice(bodyStart).join("\n").trim()

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

export default chapters
