import { Explorer } from "../components/Explorer"
import { Canvas } from "../components/Canvas"

function App() {
  return (
    <div className="flex h-screen gap-1 p-2">
      <Explorer />
      <Canvas />
    </div>
  )
}

export default App
