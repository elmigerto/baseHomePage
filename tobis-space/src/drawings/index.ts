const imageModules = import.meta.glob('./**/*.{jpg,JPG,jpeg,JPEG,png}', {
\teager: true,
\timport: 'default',
})

export interface Drawing {
\tid: string
\tname: string
\tcategory: string
\tprice: number
\timage: string
}

const drawings: Drawing[] = Object.entries(imageModules).map(([path, url]) => {
\tconst fullPath = path.slice(2)
\tconst parts = fullPath.split('/')
\tconst file = parts.pop() as string
\tconst category = parts.join('/')
\tconst name = file
\t\t.replace(/\.[^./]+$/, '')
\t\t.replace(/[_-]/g, ' ')
\treturn {
\t\tid: fullPath,
\t\tname,
\t\tcategory,
\t\tprice: 9.99,
\t\timage: url as string,
\t}
})

export const categories = Array.from(new Set(drawings.map((d) => d.category)))

export default drawings
