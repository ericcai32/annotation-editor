interface ExplorerProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
  images: string[]
  setImages: (images: string[]) => void
}

function Explorer({
  className,
  importInputRef,
  images,
  setImages,
}: ExplorerProps) {
  const files: string[] = [
    "index.html",
    "App.tsx",
    "Explorer.tsx",
    "styles.css",
    "package.json",
    "index.html",
    "App.tsx",
    "Explorer.tsx",
    "styles.css",
    "package.json",
    "index.html",
    "App.tsx",
    "Explorer.tsx",
    "styles.css",
    "package.json",
    "index.html",
    "App.tsx",
    "Explorer.tsx",
    "styles.css",
    "package.json",
    "index.html",
    "App.tsx",
    "Explorer.tsx",
    "styles.css",
    "package.json",
    "index.html",
    "App.tsx",
    "Explorer.tsx",
    "styles.css",
    "package.json",
  ]

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/"),
      )
      const imageUrls = imageFiles.map((file) => URL.createObjectURL(file))
      setImages(imageUrls)
      console.log(imageUrls)
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
        {files.map((file, index) => (
          <p key={index} className="cursor-pointer p-2 hover:bg-gray-100">
            {file}
          </p>
        ))}
      </div>
    </div>
  )
}

export { Explorer }
