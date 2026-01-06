import { useEffect, useState } from "react"
import type { boundingBox, dimensions, coords } from "../types/index"
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
  imageDimensions: dimensions[]
  setImageDimensions: (dimensions: dimensions[]) => void
  annotations: boundingBox[][]
  setAnnotations: (annotations: boundingBox[][]) => void
  currIdx: number
}

function Canvas({
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
}: CanvasProps) {
  useEffect(() => {
    new Image().src = frame_1778
    new Image().src = frame_2087
    new Image().src = frame_2133
    new Image().src = frame_2210
    new Image().src = frame_2432
    new Image().src = frame_2697
  }, [])

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
    setImageDimensions([
      { width: 720, height: 480 },
      { width: 720, height: 480 },
      { width: 720, height: 480 },
      { width: 720, height: 480 },
      { width: 720, height: 480 },
      { width: 720, height: 480 },
      { width: 720, height: 480 },
    ])
    setAnnotations([
      [{ id: crypto.randomUUID(), x: 396, y: 88, width: 16, height: 15 }],
      [{ id: crypto.randomUUID(), x: 531, y: 234, width: 34, height: 40 }],
      [],
      [{ id: crypto.randomUUID(), x: 204, y: 240, width: 44, height: 56 }],
      [{ id: crypto.randomUUID(), x: 226, y: 173, width: 89, height: 113 }],
      [{ id: crypto.randomUUID(), x: 210, y: 286, width: 193, height: 190 }],
    ])
  }
  const [isDrawing, setIsDrawing] = useState(false)
  const [startCoords, setStartCoords] = useState<coords | null>(null)
  const [draggedBoxIdx, setDraggedBoxIdx] = useState<number | null>(null)
  const [handle, setHandle] = useState<string | null>(null)
  const [offset, setOffset] = useState<coords | null>(null)

  const getMouseCoords = (e: React.MouseEvent) => {
    const svg = e.currentTarget as SVGSVGElement
    const CTM = svg.getScreenCTM()
    if (!CTM) return { x: 0, y: 0 }
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d,
    }
  }

  const clampMouseCoords = (coords: coords) => {
    coords.x = Math.max(0, Math.min(coords.x, imageDimensions[currIdx].width))
    coords.y = Math.max(0, Math.min(coords.y, imageDimensions[currIdx].height))
    return coords
  }

  const isInbox = (x: number, y: number, box: boundingBox): boolean => {
    return (
      x >= box.x &&
      x <= box.x + box.width &&
      y >= box.y &&
      y <= box.y + box.height
    )
  }

  const getHandle = (x: number, y: number, box: boundingBox) => {
    const threshold = 5 // sensitivity for grabbing handles

    if (Math.abs(x - box.x) < threshold && Math.abs(y - box.y) < threshold) {
      return "top-left"
    }
    if (
      Math.abs(x - (box.x + box.width)) < threshold &&
      Math.abs(y - box.y) < threshold
    ) {
      return "top-right"
    }
    if (
      Math.abs(x - box.x) < threshold &&
      Math.abs(y - (box.y + box.height)) < threshold
    ) {
      return "bottom-left"
    }
    if (
      Math.abs(x - (box.x + box.width)) < threshold &&
      Math.abs(y - (box.y + box.height)) < threshold
    ) {
      return "bottom-right"
    }
    if (
      Math.abs(y - box.y) < threshold &&
      x >= box.x &&
      x <= box.x + box.width
    ) {
      return "top"
    }
    if (
      Math.abs(y - (box.y + box.height)) < threshold &&
      x >= box.x &&
      x <= box.x + box.width
    ) {
      return "bottom"
    }
    if (
      Math.abs(x - box.x) < threshold &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      return "left"
    }
    if (
      Math.abs(x - (box.x + box.width)) < threshold &&
      y >= box.y &&
      y <= box.y + box.height
    ) {
      return "right"
    }
    if (isInbox(x, y, box)) {
      return "middle"
    }
    return null
  }

  const editAt = (x: number, y: number) => {
    if (!handle || draggedBoxIdx === null || offset === null) {
      return
    }

    const newAnnotations = [...annotations]
    const newBox = newAnnotations[currIdx][draggedBoxIdx]

    if (handle === "top-left") {
      newBox.width = newBox.width + (newBox.x - x)
      newBox.height = newBox.height + (newBox.y - y)
      newBox.x = x
      newBox.y = y
    } else if (handle === "top-right") {
      newBox.width = x - newBox.x
      newBox.height = newBox.height + (newBox.y - y)
      newBox.y = y
    } else if (handle === "bottom-left") {
      newBox.width = newBox.width + (newBox.x - x)
      newBox.height = y - newBox.y
      newBox.x = x
    } else if (handle === "bottom-right") {
      newBox.width = x - newBox.x
      newBox.height = y - newBox.y
    } else if (handle === "top") {
      newBox.height = newBox.height + (newBox.y - y)
      newBox.y = y
    } else if (handle === "bottom") {
      newBox.height = y - newBox.y
    } else if (handle === "left") {
      newBox.width = newBox.width + (newBox.x - x)
      newBox.x = x
    } else if (handle === "right") {
      newBox.width = x - newBox.x
    } else if (handle === "middle") {
      newBox.x = x - offset.x
      newBox.y = y - offset.y
    }

    setAnnotations(newAnnotations)
  }

  const drawAt = (x: number, y: number) => {
    if (isDrawing && startCoords) {
      const newAnnotations = [...annotations]
      newAnnotations[currIdx].splice(newAnnotations[currIdx].length - 1, 1, {
        id: annotations[currIdx][annotations[currIdx].length - 1].id,
        x: Math.min(x, startCoords.x),
        y: Math.min(y, startCoords.y),
        width: Math.abs(x - startCoords.x),
        height: Math.abs(y - startCoords.y),
      })
      setAnnotations(newAnnotations)
    } else {
      const newAnnotations = [...annotations]
      newAnnotations[currIdx].push({
        id: crypto.randomUUID(),
        x: x,
        y: y,
        width: 0,
        height: 0,
      })
      setAnnotations(newAnnotations)
      setIsDrawing(true)
      setStartCoords({ x, y })
    }
  }

  const removeAt = (x: number, y: number) => {
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
    const { x, y } = clampMouseCoords(getMouseCoords(e))

    if (e.button === 0) {
      for (const box of annotations[currIdx]) {
        const newHandle = getHandle(x, y, box)
        if (newHandle !== null) {
          setDraggedBoxIdx(annotations[currIdx].indexOf(box))
          setHandle(newHandle)
          setOffset({ x: x - box.x, y: y - box.y })
          return
        }
      }

      drawAt(x, y)
    } else if (e.button === 2) {
      removeAt(x, y)
    }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    const { x, y } = clampMouseCoords(getMouseCoords(e))

    if (e.button === 0) {
      if (handle && draggedBoxIdx !== null && offset !== null) {
        editAt(x, y)
      } else if (isDrawing && startCoords) {
        drawAt(x, y)
      }
    } else if (e.button === 2) {
      removeAt(x, y)
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
    return annotations[currIdx].map((box) => (
      <g key={box.id}>
        <rect
          width={box.width}
          height={box.height}
          x={box.x}
          y={box.y}
          fill="transparent"
          stroke="#000000"
          strokeWidth="0.4%"
        />
        <rect
          width={box.width}
          height={box.height}
          x={box.x}
          y={box.y}
          fill="transparent"
          stroke="#00ff00"
          strokeWidth="0.2%"
        />
      </g>
    ))
  }

  return (
    <div
      className={`flex items-center justify-center bg-zinc-950 ${className}`}
    >
      {names[currIdx] ? (
        <svg
          className="h-full w-full hover:cursor-crosshair"
          viewBox={`0 0 ${imageDimensions[currIdx].width} ${imageDimensions[currIdx].height}`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onContextMenu={onContextMenu}
        >
          <image
            href={images[currIdx] ? images[currIdx] : undefined}
            className="h-full w-full"
          />
          {drawAnnotations()}
        </svg>
      ) : (
        <div className="text-center text-zinc-500">
          <p className="mb-8 text-lg">
            <span className="font-semibold text-zinc-300">Controls:</span>
            <br />
            Left-click and drag to draw a new bounding box.
            <br />
            Right-click a bounding box to remove it.
            <br />
            Drag the middle of a bounding box to move it.
            <br />
            Drag an edge or corner of a bounding box to resize it.
          </p>
          <p className="text-sm">
            <span
              className="cursor-pointer text-orange-400 transition-colors hover:text-orange-300"
              onClick={() => importInputRef.current?.click()}
            >
              Import files
            </span>{" "}
            to begin, or{" "}
            <span
              className="cursor-pointer text-orange-400 transition-colors hover:text-orange-300"
              onClick={onDemoClick}
            >
              try the demo
            </span>
            .
          </p>
        </div>
      )}
    </div>
  )
}

export { Canvas }
