import { useEffect, useRef } from "react"

interface ExplorerProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
  names: string[]
  setNames: (names: string[]) => void
  images: string[]
  setImages: (images: string[]) => void
  annotations: string[]
  setAnnotations: (annotations: string[]) => void
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
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files)
      const newNamesToContent = new Map<string, Map<string, string>>()

      for (const file of files) {
        const noExtension = file.name.replace(/\.[^.]*$/, "")
        if (!newNamesToContent.has(noExtension)) {
          newNamesToContent.set(noExtension, new Map<string, string>())
        }
        if (file.type.startsWith("image/")) {
          if (newNamesToContent.get(noExtension)?.has("image")) {
            console.log(`${noExtension} already has an image`)
          } else {
            newNamesToContent
              .get(noExtension)
              ?.set("image", URL.createObjectURL(file))
          }
        } else if (file.type.startsWith("text/plain")) {
          if (newNamesToContent.get(noExtension)?.has("annotation")) {
            console.log(`${noExtension} already has an annotation`)
          } else {
            // TODO: handle annotations
          }
        }
      }

      const namesToContent = new Map<string, Map<string, string>>(
        names.map((name, index) => [
          name,
          new Map([
            ["image", images[index]],
            ["annotation", annotations[index]], // TODO: add annotations
          ]),
        ]),
      )

      newNamesToContent.forEach((content, name) => {
        if (!namesToContent.has(name)) {
          namesToContent.set(name, content)
        } else {
          console.log(`${name} already exists`)
        }
      })

      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      })
      const sortedNamesToContent = Array.from(namesToContent.entries()).sort(
        (a, b) => collator.compare(a[0], b[0]),
      )
      setNames(sortedNamesToContent.map((entry) => entry[0]))
      setImages(
        sortedNamesToContent.map((entry) => entry[1].get("image") ?? ""),
      ) // TODO: add default image
      setAnnotations(
        sortedNamesToContent.map((entry) => entry[1].get("annotation") ?? ""),
      )
    }
  }

  const pRefs = useRef<HTMLParagraphElement[]>([])
  useEffect(() => {
    // pRefs.current[currIdx]?.focus()
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
