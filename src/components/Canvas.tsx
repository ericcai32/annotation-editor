import { useEffect, useState } from "react"
import frame_1778 from "../assets/demo-files/frame_1778.jpg"
import frame_2087 from "../assets/demo-files/frame_2087.jpg"
import frame_2133 from "../assets/demo-files/frame_2133.jpg"
import frame_2210 from "../assets/demo-files/frame_2210.jpg"
import frame_2432 from "../assets/demo-files/frame_2432.jpg"
import frame_2697 from "../assets/demo-files/frame_2697.jpg"

interface CanvasProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
  names: string[]
  setNames: (names: string[]) => void
  images: string[]
  setImages: (images: string[]) => void
  annotations: number[][][]
  setAnnotations: (annotations: number[][][]) => void
  currIdx: number
}

function Canvas({
  className,
  importInputRef,
  names,
  setNames,
  images,
  setImages,
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

  const onDemoClick = () => {
    setNames([
      "frame_1778",
      "frame_2087",
      "frame_2133",
      "frame_2210",
      "frame_2432",
      "frame_2697",
    ])
    setImages([
      frame_1778,
      frame_2087,
      frame_2133,
      frame_2210,
      frame_2432,
      frame_2697,
    ])
    setAnnotations([
      [[396, 88, 16, 15]],
      [[531, 234, 34, 40]],
      [[]],
      [[204, 240, 44, 56]],
      [[226, 173, 89, 113]],
      [[210, 286, 193, 190]],
    ])
  }

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
          <span
            className="cursor-pointer text-blue-500 hover:underline"
            onClick={onDemoClick}
          >
            try the demo
          </span>
          .
        </p>
      )}
    </div>
  )
}

export { Canvas }
