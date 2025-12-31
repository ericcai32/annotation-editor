import { useEffect, useRef, useState } from "react"
import { Explorer } from "../components/Explorer"
import { Canvas } from "../components/Canvas"

function App() {
  const importInputRef = useRef<HTMLInputElement>(null)
  const [names, setNames] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [annotations, setAnnotations] = useState<number[][][]>([])
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

  return (
    <main className="flex h-screen w-screen gap-1 p-2">
      <Explorer
        className="h-full w-1/5 border"
        importInputRef={importInputRef}
        names={names}
        setNames={setNames}
        images={images}
        setImages={setImages}
        annotations={annotations}
        setAnnotations={setAnnotations}
        currIdx={currIdx}
        setCurrIdx={setCurrIdx}
      />
      <Canvas
        className="h-full w-4/5 border"
        importInputRef={importInputRef}
        names={names}
        setNames={setNames}
        images={images}
        setImages={setImages}
        annotations={annotations}
        setAnnotations={setAnnotations}
        currIdx={currIdx}
      />
    </main>
  )
}

export default App
