import { useEffect, useRef, useState } from "react"
import { Explorer } from "../components/Explorer"
import { Canvas } from "../components/Canvas"
import type { boundingBox, dimensions } from "../types/index"

function App() {
  const importInputRef = useRef<HTMLInputElement>(null)
  const [names, setNames] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [imageDimensions, setImageDimensions] = useState<dimensions[]>([])
  const [annotations, setAnnotations] = useState<boundingBox[][]>([])
  const [currIdx, setCurrIdx] = useState<number>(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        setCurrIdx((prev) => Math.max(0, prev - 1))
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        setCurrIdx((prev) => Math.min(images.length - 1, prev + 1))
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [images.length])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-200">
      <Explorer
        className="w-1/5 min-w-[250px]"
        importInputRef={importInputRef}
        names={names}
        setNames={setNames}
        images={images}
        setImages={setImages}
        imageDimensions={imageDimensions}
        setImageDimensions={setImageDimensions}
        annotations={annotations}
        setAnnotations={setAnnotations}
        currIdx={currIdx}
        setCurrIdx={setCurrIdx}
      />
      <Canvas
        className="h-full w-full"
        importInputRef={importInputRef}
        names={names}
        setNames={setNames}
        images={images}
        setImages={setImages}
        imageDimensions={imageDimensions}
        setImageDimensions={setImageDimensions}
        annotations={annotations}
        setAnnotations={setAnnotations}
        currIdx={currIdx}
      />
    </main>
  )
}

export default App
