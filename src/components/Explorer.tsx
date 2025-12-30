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
      const oldNamesToContent = new Map<string, Map<string, string>>(
        names.map((name, index) => [
          name,
          new Map([
            ["image", images[index]],
            ["annotation", annotations[index]], // TODO: add annotations
          ]),
        ]),
      )
      const newNamesToContent = new Map<string, Map<string, string>>()

      for (const file of files) {
        if (!newNamesToContent.has(file.name)) {
          newNamesToContent.set(file.name, new Map<string, string>())
        }
        if (file.type.startsWith("image/")) {
          newNamesToContent
            .get(file.name)
            ?.set("image", URL.createObjectURL(file))
        } else if (file.type.startsWith("text/plain")) {
          // TODO: handle annotations
        }
      }

      const namesToContent = new Map<string, Map<string, string>>([
        ...oldNamesToContent,
      ])

      newNamesToContent.forEach((content, name) => {
        if (!namesToContent.has(name)) {
          namesToContent.set(name, content)
        } else {
          if (!namesToContent.get(name)?.get("image")) {
            namesToContent.get(name)?.set("image", content.get("image") ?? "")
          }
          if (!namesToContent.get(name)?.get("annotation")) {
            namesToContent
              .get(name)
              ?.set("annotation", content.get("annotation") ?? "")
          }
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
          <p key={index} className="cursor-pointer p-2 hover:bg-gray-100">
            {name}
          </p>
        ))}
      </div>
    </div>
  )
}
export { Explorer }
