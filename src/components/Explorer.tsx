import { useEffect, useRef } from "react"

interface ExplorerProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
  names: string[]
  setNames: (names: string[]) => void
  images: string[]
  setImages: (images: string[]) => void
  annotations: number[][][]
  setAnnotations: (annotations: number[][][]) => void
  currIdx: number
  setCurrIdx: (currIdx: number) => void
}

function Explorer({
  className,
  importInputRef,
  names,
  setNames,
  images,
  setImages,
  annotations,
  setAnnotations,
  currIdx,
  setCurrIdx,
}: ExplorerProps) {
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files)
      const newNamesToContent = new Map<string, [string, number[][]]>()

      for (const file of files) {
        const newName = file.name.replace(/\.[^.]*$/, "")
        if (!newNamesToContent.has(newName)) {
          newNamesToContent.set(newName, ["", []]) // TODO: add default image and change missing image checks
        }

        if (file.type.startsWith("image/")) {
          if (newNamesToContent.get(newName)?.[0]) {
            console.log(`${newName} already has an image`)
          } else {
            newNamesToContent
              .get(newName)
              ?.splice(0, 1, URL.createObjectURL(file))
          }
        } else if (file.type.startsWith("text/plain")) {
          if ((newNamesToContent.get(newName)?.[1] ?? []).length > 0) {
            console.log(`${newName} already has an annotation`)
          } else {
            const text = await file.text()
            const annotation = text
              .trim()
              .split("\n")
              .map((line) => {
                const box = line.trim().split(/\s+/).map(Number)
                if (box.length !== 4 || box.some((n) => isNaN(n))) {
                  console.log(`${newName} has invalid annotation: ${line}`)
                  return []
                }
                return box
              })
              .filter((box) => box.length > 0)
            newNamesToContent.get(newName)?.splice(1, 1, annotation)
          }
        }
      }

      const namesToContent = new Map<string, [string, number[][]]>(
        names.map((name, index) => [name, [images[index], annotations[index]]]),
      )

      for (const [name, content] of newNamesToContent) {
        if (!namesToContent.has(name)) {
          namesToContent.set(name, content)
          continue
        }

        if (content[0]) {
          if (namesToContent.get(name)?.[0]) {
            console.log(`${name} already has an image`)
          } else {
            namesToContent.get(name)?.splice(0, 1, content[0])
          }
        }
        if (content[1]) {
          if ((namesToContent.get(name)?.[1] ?? []).length > 0) {
            console.log(`${name} already has an annotation`)
          } else {
            namesToContent.get(name)?.splice(1, 1, content[1])
          }
        }
      }

      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      })
      const sortedNamesToContent = Array.from(namesToContent.entries()).sort(
        (a, b) => collator.compare(a[0], b[0]),
      )
      setNames(sortedNamesToContent.map((entry) => entry[0]))
      setImages(sortedNamesToContent.map((entry) => entry[1][0]))
      setAnnotations(sortedNamesToContent.map((entry) => entry[1][1]))
    }
  }

  const pRefs = useRef<HTMLParagraphElement[]>([])
  useEffect(() => {
    pRefs.current[currIdx]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    })
  }, [currIdx])

  return (
    <div className={`flex flex-col ${className}`}>
      <header className="flex items-center justify-between p-2">
        <h1>Files</h1>
        <div className="flex gap-2">
          <input
            className="hidden"
            type="file"
            ref={importInputRef}
            onChange={handleImport}
            accept="image/*, .txt"
            multiple
          />
          <button
            className="rounded bg-gray-200 p-1 hover:bg-gray-300"
            title="Import"
            onClick={() => importInputRef.current?.click()}
          >
            I
          </button>
          <button
            className="rounded bg-gray-200 p-1 hover:bg-gray-300"
            title="Export"
          >
            E
          </button>
        </div>
      </header>
      <div className="overflow-auto">
        {names.map((name, index) => (
          <p
            className={`cursor-pointer p-2 ${
              index === currIdx ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            key={index}
            onClick={() => setCurrIdx(index)}
            ref={(el: HTMLParagraphElement) => {
              pRefs.current[index] = el
            }}
          >
            {name}
          </p>
        ))}
      </div>
    </div>
  )
}

export { Explorer }
