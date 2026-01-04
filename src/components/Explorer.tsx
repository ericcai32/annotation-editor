import { useEffect, useRef } from "react"
import JSZip from "jszip"
import { saveAs } from "file-saver"

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
  const pRefs = useRef<HTMLParagraphElement[]>([])
  useEffect(() => {
    pRefs.current[currIdx]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    })
  }, [currIdx])

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
        names.map((name, i) => [name, [images[i], annotations[i]]]),
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

  const xywhToYolo = (idx: number) => {
    return new Promise<string[]>((resolve) => {
      const img = new Image()
      img.src = images[idx]
      img.onload = () => {
        const yoloAnnotation = annotations[idx].map(([x, y, width, height]) => {
          const centerX = x + width / 2
          const centerY = y + height / 2
          const normalizedCenterX = centerX / img.width
          const normalizedCenterY = centerY / img.height
          const normalizedWidth = width / img.width
          const normalizedHeight = height / img.height
          return `0 ${normalizedCenterX} ${normalizedCenterY} ${normalizedWidth} ${normalizedHeight}`
        })
        resolve(yoloAnnotation)
      }
    })
  }

  const handleExport = async () => {
    const zip = new JSZip()
    for (const [i, name] of names.entries()) {
      const yoloAnnotation = await xywhToYolo(i)
      const blob = new Blob([yoloAnnotation.join("\n")], {
        type: "text/plain",
      })
      zip.file(`labels/${name}.txt`, blob)
    }
    const zipBlob = await zip.generateAsync({ type: "blob" })
    saveAs(zipBlob, "labels.zip")
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
            onClick={handleExport}
          >
            E
          </button>
        </div>
      </header>
      <div className="overflow-auto">
        {names.map((name, i) => (
          <p
            className={`cursor-pointer p-2 ${
              i === currIdx ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            key={name}
            onClick={() => setCurrIdx(i)}
            ref={(el: HTMLParagraphElement) => {
              pRefs.current[i] = el
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
