import { useEffect, useState } from "react"

interface CanvasProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
  names: string[]
  images: string[]
  annotations: number[][][]
  setAnnotations: (annotations: number[][][]) => void
  currIdx: number
}

function Canvas({
  className,
  importInputRef,
  names,
  images,
  annotations,
  setAnnotations,
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

  const drawAnnotations = () => {
    return annotations[currIdx].map(([x, y, width, height], index) => (
      <g key={index}>
        <rect
          width={width}
          height={height}
          x={x}
          y={y}
          fill="transparent"
          stroke="#000000"
          strokeWidth="0.4%"
        />
        <rect
          width={width}
          height={height}
          x={x}
          y={y}
          fill="transparent"
          stroke="#00ff00"
          strokeWidth="0.2%"
        />
      </g>
    ))
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
    >
      {names[currIdx] ? (
        <svg className="h-full w-full" viewBox={viewBox}>
          <image href={images[currIdx]} className="h-full w-full" />
          {drawAnnotations()}
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
