function Explorer() {
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
    <div className="flex h-full w-1/5 flex-col border">
      <h1 className="p-2">Explorer</h1>
      <div className="overflow-auto">
        {files.map((file) => (
          <p className="cursor-pointer p-2 hover:bg-gray-100">{file}</p>
        ))}
      </div>
      <div className="mt-auto flex justify-center gap-4 p-2">
        <button className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300">
          Import
        </button>
        <button className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300">
          Export
        </button>
      </div>
    </div>
  )
}

export { Explorer }
