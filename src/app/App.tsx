import { useRef, useState } from "react"
import { Explorer } from "../components/Explorer"
import { Canvas } from "../components/Canvas"

function App() {
  const importInputRef = useRef<HTMLInputElement>(null)
  const [names, setNames] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [annotations, setAnnotations] = useState<string[]>([])
  const [currIdx, setCurrIdx] = useState<number>(0)

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
        idx={currIdx}
        setIdx={setCurrIdx}
      />
      <Canvas
        className="h-full w-4/5 border"
        importInputRef={importInputRef}
        images={images}
      />
    </main>
  )
}

export default App
