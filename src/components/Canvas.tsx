interface CanvasProps {
  className?: string
  importInputRef: React.RefObject<HTMLInputElement | null>
}

function Canvas({ className, importInputRef }: CanvasProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
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
    </div>
  )
}

export { Canvas }
