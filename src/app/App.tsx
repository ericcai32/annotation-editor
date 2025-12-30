import { useRef, useState } from "react"
import { Explorer } from "../components/Explorer"
import { Canvas } from "../components/Canvas"

function App() {
  const importInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>([])

  return (
    <main className="flex h-screen w-screen gap-1 p-2">
      <Explorer
        className="h-full w-1/5 border"
        importInputRef={importInputRef}
        images={images}
        setImages={setImages}
      />
      <Canvas
        className="h-full w-4/5 border"
        importInputRef={importInputRef}
        images={images}
        setImages={setImages}
      />
    </main>
  )
}

export default App
