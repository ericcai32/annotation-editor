import { useEffect, useState } from "react"

interface CanvasProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
  names: string[]
  images: string[]
  currIdx: number
}

function Canvas({
  className,
  importInputRef,
  names,
  images,
  currIdx,
}: CanvasProps) {
  const [viewBox, setViewBox] = useState<string>("0 0 0 0")

  useEffect(() => {
    const img = new Image()
    img.src = images[currIdx]
    img.onload = () => {
      setViewBox(`0 0 ${img.width} ${img.height}`)
    }
  }, [images[currIdx]])

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
    >
      {names[currIdx] ? (
        <svg className="h-full w-full" viewBox={viewBox}>
          <image href={images[currIdx]} className="h-full w-full" />
          <rect
            width="200"
            height="100"
            x="5"
            y="5"
            fill="transparent"
            stroke="#000000"
            strokeWidth="0.4%"
          />
          <rect
            width="200"
            height="100"
            x="5"
            y="5"
            fill="transparent"
            stroke="#00ff00"
            strokeWidth="0.2%"
          />
        </svg>
      ) : (
        <p className="text-center text-lg whitespace-pre">
          <span
            className="cursor-pointer text-blue-500 hover:underline"
            onClick={() => importInputRef.current?.click()}
          >
            Import files
          </span>{" "}
          to begin, or{" "}
          <span className="cursor-pointer text-blue-500 hover:underline">
            try the demo
          </span>
          .
        </p>
      )}
    </div>
  )
}

export { Canvas }
