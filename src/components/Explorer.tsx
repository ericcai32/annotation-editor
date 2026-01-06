import { useEffect, useRef } from "react"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import type { boundingBox, dimensions } from "../types/index"

interface ExplorerProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
  names: string[]
  setNames: (names: string[]) => void
  images: string[]
  setImages: (images: string[]) => void
  imageDimensions: dimensions[]
  setImageDimensions: (imageDimensions: dimensions[]) => void
  annotations: boundingBox[][]
  setAnnotations: (annotations: boundingBox[][]) => void
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
  imageDimensions,
  setImageDimensions,
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

  const getImageDimensions = (image: string) => {
    return new Promise<dimensions>((resolve) => {
      const img = new Image()
      img.src = image
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
    })
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newNamesToContent = new Map<
        string,
        [string, dimensions, boundingBox[]]
      >()

      for (const file of files) {
        const newName = file.name.replace(/\.[^.]*$/, "")
        if (!newNamesToContent.has(newName)) {
          newNamesToContent.set(newName, ["", { width: 0, height: 0 }, []]) // TODO: add default image and change missing image checks
        }

        if (file.type.startsWith("image/")) {
          if (newNamesToContent.get(newName)?.[0]) {
            console.log(`${newName} already has an image`)
          } else {
            const dataURL = URL.createObjectURL(file)
            const dimensions = await getImageDimensions(dataURL)
            newNamesToContent.get(newName)?.splice(0, 2, dataURL, dimensions)
          }
        } else if (file.type.startsWith("text/plain")) {
          if ((newNamesToContent.get(newName)?.[2] ?? []).length > 0) {
            console.log(`${newName} already has an annotation`)
          } else {
            const text = await file.text()
            const annotation = text
              .trim()
              .split("\n")
              .map((line) => {
                const xywh = line.trim().split(/\s+/).map(Number)
                if (xywh.length !== 4 || xywh.some((n) => isNaN(n))) {
                  console.log(`${newName} has invalid annotation: ${line}`)
                  return null
                }
                return {
                  id: crypto.randomUUID(),
                  x: xywh[0],
                  y: xywh[1],
                  width: xywh[2],
                  height: xywh[3],
                }
              })
              .filter((box) => box !== null)
            newNamesToContent.get(newName)?.splice(2, 1, annotation)
          }
        }
      }

      const namesToContent = new Map<
        string,
        [string, dimensions, boundingBox[]]
      >(
        names.map((name, i) => [
          name,
          [images[i], imageDimensions[i], annotations[i]],
        ]),
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
            namesToContent.get(name)?.splice(0, 2, content[0], content[1])
          }
        }
        if (content[2]) {
          if ((namesToContent.get(name)?.[2] ?? []).length > 0) {
            console.log(`${name} already has an annotation`)
          } else {
            namesToContent.get(name)?.splice(2, 1, content[2])
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
      setImageDimensions(sortedNamesToContent.map((entry) => entry[1][1]))
      setAnnotations(sortedNamesToContent.map((entry) => entry[1][2]))
    }
  }

  const xywhToYolo = (idx: number) => {
    const yoloAnnotation = annotations[idx].map((box) => {
      const centerX = box.x + box.width / 2
      const centerY = box.y + box.height / 2
      const normalizedCenterX = centerX / imageDimensions[idx].width
      const normalizedCenterY = centerY / imageDimensions[idx].height
      const normalizedWidth = box.width / imageDimensions[idx].width
      const normalizedHeight = box.height / imageDimensions[idx].height
      return `0 ${normalizedCenterX} ${normalizedCenterY} ${normalizedWidth} ${normalizedHeight}`
    })
    return yoloAnnotation
  }

  const handleExport = () => {
    const zip = new JSZip()
    for (const [i, name] of names.entries()) {
      const yoloAnnotation = xywhToYolo(i)
      const blob = new Blob([yoloAnnotation.join("\n")], {
        type: "text/plain",
      })
      zip.file(`labels/${name}.txt`, blob)
    }
    zip
      .generateAsync({ type: "blob" })
      .then((blob) => saveAs(blob, "labels.zip"))
  }

  return (
    <div
      className={`flex flex-col border-r border-zinc-800 bg-zinc-900 ${className}`}
    >
      <header className="flex items-center justify-between border-b border-zinc-800 p-4">
        <h1 className="text-base font-semibold tracking-wider text-zinc-400 uppercase">
          Files
        </h1>
        <div className="flex gap-1">
          <input
            className="hidden"
            type="file"
            ref={importInputRef}
            onChange={handleImport}
            accept="image/*, .txt"
            multiple
          />
          <button
            className="flex items-center justify-center rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            title="Import"
            onClick={() => importInputRef.current?.click()}
          >
            <span className="material-symbols-outlined text-[20px]">
              upload
            </span>
          </button>
          <button
            className="flex items-center justify-center rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            title="Export"
            onClick={handleExport}
          >
            <span className="material-symbols-outlined text-[20px]">
              download
            </span>
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-2">
        {names.map((name, i) => (
          <p
            className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${
              i === currIdx
                ? "bg-orange-500/10 font-medium text-orange-400"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
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
