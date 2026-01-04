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
  const [isDrawing, setIsDrawing] = useState(false)
  const [startCoords, setStartCoords] = useState<{
    x: number
    y: number
  } | null>(null)
  const [draggedBoxIdx, setDraggedBoxIdx] = useState<number | null>(null)
  const [handle, setHandle] = useState<string | null>(null)
  const [offset, setOffset] = useState<{
    x: number
    y: number
  } | null>(null)

  const getMouseCoords = (e: React.MouseEvent) => {
    const svg = e.currentTarget as SVGSVGElement
    const CTM = svg.getScreenCTM()
    if (!CTM) return { x: 0, y: 0 }
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d,
    }
  }

  const isInbox = (x: number, y: number, box: number[]): boolean => {
    return (
      x >= box[0] && x <= box[0] + box[2] && y >= box[1] && y <= box[1] + box[3]
    )
  }

  const getHandle = (x: number, y: number, box: number[]) => {
    const [bx, by, bw, bh] = box
    const threshold = 5 // sensitivity for grabbing handles

    if (Math.abs(x - bx) < threshold && Math.abs(y - by) < threshold) {
      return "top-left"
    }
    if (Math.abs(x - (bx + bw)) < threshold && Math.abs(y - by) < threshold) {
      return "top-right"
    }
    if (Math.abs(x - bx) < threshold && Math.abs(y - (by + bh)) < threshold) {
      return "bottom-left"
    }
    if (
      Math.abs(x - (bx + bw)) < threshold &&
      Math.abs(y - (by + bh)) < threshold
    ) {
      return "bottom-right"
    }
    if (Math.abs(y - by) < threshold && x >= bx && x <= bx + bw) {
      return "top"
    }
    if (Math.abs(y - (by + bh)) < threshold && x >= bx && x <= bx + bw) {
      return "bottom"
    }
    if (Math.abs(x - bx) < threshold && y >= by && y <= by + bh) {
      return "left"
    }
    if (Math.abs(x - (bx + bw)) < threshold && y >= by && y <= by + bh) {
      return "right"
    }
    if (isInbox(x, y, box)) {
      return "middle"
    }
    return null
  }

  const editAtCoords = (x: number, y: number) => {
    if (!handle || draggedBoxIdx === null || offset === null) {
      return
    }

    const newAnnotations = [...annotations]
    const box = [...newAnnotations[currIdx][draggedBoxIdx]]

    if (handle === "top-left") {
      box[2] = box[2] + (box[0] - x)
      box[3] = box[3] + (box[1] - y)
      box[0] = x
      box[1] = y
    } else if (handle === "top-right") {
      box[2] = x - box[0]
      box[3] = box[3] + (box[1] - y)
      box[1] = y
    } else if (handle === "bottom-left") {
      box[2] = box[2] + (box[0] - x)
      box[3] = y - box[1]
      box[0] = x
    } else if (handle === "bottom-right") {
      box[2] = x - box[0]
      box[3] = y - box[1]
    } else if (handle === "top") {
      box[3] = box[3] + (box[1] - y)
      box[1] = y
    } else if (handle === "bottom") {
      box[3] = y - box[1]
    } else if (handle === "left") {
      box[2] = box[2] + (box[0] - x)
      box[0] = x
    } else if (handle === "right") {
      box[2] = x - box[0]
    } else if (handle === "middle") {
      box[0] = x - offset.x
      box[1] = y - offset.y
    }

    newAnnotations[currIdx][draggedBoxIdx] = box
    setAnnotations(newAnnotations)
  }

  const drawAtCoords = (x: number, y: number) => {
    if (isDrawing && startCoords) {
      const newAnnotations = [...annotations]
      newAnnotations[currIdx].splice(newAnnotations[currIdx].length - 1, 1, [
        Math.min(x, startCoords.x),
        Math.min(y, startCoords.y),
        Math.abs(x - startCoords.x),
        Math.abs(y - startCoords.y),
      ])
      setAnnotations(newAnnotations)
    } else {
      const newAnnotations = [...annotations]
      newAnnotations[currIdx].push([x, y, 0, 0])
      setAnnotations(newAnnotations)
      setIsDrawing(true)
      setStartCoords({ x, y })
    }
  }

  const removeAtCoords = (x: number, y: number) => {
    const idxToRemove = annotations[currIdx].findIndex((box) =>
      isInbox(x, y, box),
    )
    if (idxToRemove !== -1) {
      const newAnnotations = [...annotations]
      newAnnotations[currIdx].splice(idxToRemove, 1)
      setAnnotations(newAnnotations)
    }
  }

  const onMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getMouseCoords(e)

    if (e.button === 0) {
      for (const box of annotations[currIdx]) {
        const newHandle = getHandle(x, y, box)
        if (newHandle !== null) {
          setDraggedBoxIdx(annotations[currIdx].indexOf(box))
          setHandle(newHandle)
          setOffset({ x: x - box[0], y: y - box[1] })
          return
        }
      }

      drawAtCoords(x, y)
    } else if (e.button === 2) {
      removeAtCoords(x, y)
    }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getMouseCoords(e)

    if (e.button === 0) {
      if (handle && draggedBoxIdx !== null && offset !== null) {
        editAtCoords(x, y)
      } else if (isDrawing && startCoords) {
        drawAtCoords(x, y)
      }
    } else if (e.button === 2) {
      removeAtCoords(x, y)
    }
  }

  const onMouseUp = () => {
    setHandle(null)
    setDraggedBoxIdx(null)
    setIsDrawing(false)
    setStartCoords(null)
    setOffset(null)
  }

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const drawAnnotations = () => {
    return annotations[currIdx].map(([x, y, width, height]) => (
      <g key={`${x}-${y}-${width}-${height}`}>
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
        <svg
          className="h-full w-full hover:cursor-crosshair"
          viewBox={viewBox}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onContextMenu={onContextMenu}
        >
          <image href={images[currIdx]} className="h-full w-full" />
          {drawAnnotations()}
        </svg>
      ) : (
        <p className="text-center text-lg whitespace-pre">
          <span className="font-bold">Controls:</span>
          <br />
          Left-click and drag to draw a new bounding box.
          <br />
          Right-click a bounding box to remove it.
          <br />
          Drag the middle of a bounding box to move it.
          <br />
          Drag an edge or corner of a bounding box to resize it.
          <br />
          <br />
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
