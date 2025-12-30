interface CanvasProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
  images: string[]
}

function Canvas({ className, importInputRef, images }: CanvasProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {images[0] ? (
        <img
          src={images[0]}
          className="absolute h-full w-full object-contain"
        />
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
