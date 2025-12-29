interface ExplorerProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
}

function Explorer({ className, importInputRef }: ExplorerProps) {
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

  return (
    <div className={`flex flex-col ${className}`}>
      <header className="flex items-center justify-between p-2">
        <h1>Explorer</h1>
        <div className="flex gap-2">
          <input
            type="file"
            ref={importInputRef}
            className="hidden"
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
