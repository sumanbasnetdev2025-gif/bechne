'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface BookImageUploadProps {
  images: File[]
  previews: string[]
  onChange: (files: File[], previews: string[]) => void
  maxFiles?: number
}

export function BookImageUpload({
  images,
  previews,
  onChange,
  maxFiles = 6,
}: BookImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remaining = maxFiles - images.length
      const newFiles = acceptedFiles.slice(0, remaining)
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f))
      onChange([...images, ...newFiles], [...previews, ...newPreviews])
    },
    [images, previews, maxFiles, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: images.length >= maxFiles,
  })

  const remove = (idx: number) => {
    URL.revokeObjectURL(previews[idx])
    onChange(
      images.filter((_, i) => i !== idx),
      previews.filter((_, i) => i !== idx)
    )
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {previews.map((src, idx) => (
          <div
            key={idx}
            className="relative aspect-[3/4] rounded-xl overflow-hidden group"
          >
            <img
              src={src}
              alt={`Photo ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
            {idx === 0 && (
              <div className="absolute bottom-2 left-2 bg-amber-800 text-white text-xs px-2 py-0.5 rounded-full">
                Cover
              </div>
            )}
          </div>
        ))}

        {images.length < maxFiles && (
          <div
            {...getRootProps()}
            className={`aspect-[3/4] rounded-xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-sm
              ${isDragActive ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-stone-200 hover:border-amber-400 text-stone-400 hover:text-amber-600'}`}
          >
            <input {...getInputProps()} />
            <Upload size={22} />
            <span className="text-xs font-medium text-center px-2">
              {isDragActive ? 'Drop here' : 'Add Photo'}
            </span>
          </div>
        )}
      </div>

      <p className="text-stone-400 text-xs flex items-center gap-1">
        <ImageIcon size={12} />
        {images.length}/{maxFiles} photos · First photo is the cover · Max 5MB each
      </p>
    </div>
  )
}