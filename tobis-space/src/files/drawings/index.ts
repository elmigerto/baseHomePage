const imageModules = import.meta.glob('./**/*.{jpg,JPG,jpeg,JPEG,png}', {
  eager: true,
  import: 'default',
})

const csvModules = import.meta.glob('./*.csv', { eager: true, as: 'raw' })
let csvData = ''
for (const data of Object.values(csvModules)) {
  if (typeof data === 'string') {
    csvData = data
    break
  }
}

interface Info {
  description: string
  price: number
  multiple: boolean
}

const infoMap = new Map<string, Info>()
if (csvData) {
  csvData
    .trim()
    .split('\n')
    .slice(1)
    .forEach((line) => {
      const [id, description, price, multiple] = line.split(',')
      if (id) {
        infoMap.set(id.trim(), {
          description: (description || 'missing description').trim(),
          price: parseFloat(price) || 0,
          multiple: multiple?.trim() === 'true',
        })
      }
    })
}

export interface Drawing {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  multiple: boolean
}

const drawings: Drawing[] = Object.entries(imageModules).map(([path, module]) => {
  const fullPath = path.slice(2) // remove leading './'
  const parts = fullPath.split('/')
  const file = parts.pop() as string
  const category = parts.join('/')
  const name = file
    .replace(/\.[^./]+$/, '') // remove extension
    .replace(/[_-]/g, ' ')
    .trim()

  const info = infoMap.get(fullPath) ?? {
    description: 'missing description',
    price: 0,
    multiple: false,
  }

  return {
    id: fullPath,
    name,
    category,
    price: info.price,
    image: module as string,
    description: info.description,
    multiple: info.multiple,
  }
})

export const categories = Array.from(new Set(drawings.map((d) => d.category)));

export default drawings;
