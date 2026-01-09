"use client"

/**
 * Image upload hook
 * 
 * Responsibilities:
 * - Upload images to server
 * - Return processed filenames
 * - Handle FormData for multipart/form-data
 * 
 * Rules:
 * - Online-only
 * - Uses useAction
 * - No toast by default
 * - Errors returned to UI
 * - This hook ONLY uploads
 * - Linking images to profile/tasks is handled elsewhere
 */

import { useCallback } from "react"
import { isOnline } from "@/lib/network"
import { getApiBaseUrl } from "@/lib/config/apiConfig"
import { getAuthToken } from "@/lib/auth"
import { parseApiError } from "@/lib/errors/parseApiError"
import type { ApiError } from "@/lib/api/api.types"
import type { ApiResponse } from "@/hooks/useApiQuery"

/**
 * Uploaded image response
 */
export interface UploadedImage {
  image_name: string
  image_url: string
}

/**
 * Failed image response
 */
export interface FailedImage {
  image_name: string
  error: string
}

/**
 * Image upload response (from API_CONTRACT.md)
 */
export interface ImageUploadResponse {
  uploaded: UploadedImage[]
  failed: FailedImage[]
}

/**
 * Create network error for offline operations
 */
function createOfflineError(): ApiError {
  return {
    status: 0,
    message: "فقدان الاتصال بالشبكة. يرجى الاتصال بالإنترنت والمحاولة مرة أخرى",
  }
}

/**
 * Return type of useImageUpload hook
 */
export interface UseImageUploadReturn {
  /**
   * Upload images (ONLINE ONLY)
   * 
   * POST /uploads/images
   * 
   * Must be online - will fail immediately if offline
   * Returns processed filenames (webp)
   */
  uploadImages: (params: {
    files: File[] | File
    folder: string
  }) => Promise<ImageUploadResponse | null>
}

/**
 * Hook for image uploads
 * 
 * Provides image upload function with proper offline handling
 * 
 * Note: This hook ONLY uploads. Linking images to profile/tasks
 * is handled elsewhere (e.g., useProfileActions.updateAvatar)
 */
export function useImageUpload(): UseImageUploadReturn {
  /**
   * Upload images (ONLINE ONLY)
   * 
   * Per API_CONTRACT.md: NOT allowed to queue (files/size/high dependency)
   */
  const uploadImages = useCallback(
    async (params: {
      files: File[] | File
      folder: string
    }): Promise<ImageUploadResponse | null> => {
      // Offline guard: fail immediately if offline
      if (!isOnline()) {
        throw createOfflineError()
      }

      // Convert single file to array
      const filesArray = Array.isArray(params.files) ? params.files : [params.files]

      // Create FormData
      const formData = new FormData()

      // Add files as images[]
      filesArray.forEach((file) => {
        formData.append("images[]", file)
      })

      // Add folder
      formData.append("folder", params.folder)

      try {
        // Note: apiExecutor uses JSON.stringify by default
        // For FormData, we need to send it directly using fetch
        const baseUrl = getApiBaseUrl()
        const token = getAuthToken()

        const response = await fetch(`${baseUrl}/uploads/images`, {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // Don't set Content-Type - browser will set it with boundary
          },
          body: formData,
        })

        if (!response.ok) {
          const error = await parseApiError(response)
          throw error
        }

        const result = await response.json()
        const apiResponse = result as ApiResponse<ImageUploadResponse>

        return apiResponse.data || null
      } catch (err) {
        if (err && typeof err === "object" && "status" in err) {
          throw err as ApiError
        }
        throw {
          status: 0,
          message: "حدث خطأ غير متوقع أثناء رفع الصور",
        } as ApiError
      }
    },
    []
  )

  return {
    uploadImages,
  }
}
