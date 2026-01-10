"use client"

/**
 * SelectUserModal - Modal for selecting a user
 * 
 * Responsibilities:
 * - Display users as cards in grid (4 per row, 2 on mobile)
 * - Search functionality
 * - Show selected user info
 * 
 * Rules:
 * - UI only - no business logic
 */

import { useState, useMemo, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { X, Search, User, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUsers } from "@/features/users"
import type { UserResource } from "@/features/users"

export interface SelectUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUserId?: number
  onSelect: (user: UserResource) => void
  isLoading?: boolean
}

export function SelectUserModal({
  open,
  onOpenChange,
  selectedUserId,
  onSelect,
  isLoading = false,
}: SelectUserModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounce search query (wait 500ms after user stops typing)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery])

  // Reset debounced query when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setDebouncedSearchQuery("")
    }
  }, [open])

  // Fetch users (only department role, active) - using debounced search
  const { users, isLoading: isUsersLoading } = useUsers({
    role: "department",
    is_active: true,
    search: debouncedSearchQuery || undefined,
  })

  const selectedUser = useMemo(() => {
    if (!selectedUserId || !users) return null
    return users.find((u) => u.id === selectedUserId) || null
  }, [selectedUserId, users])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleUserSelect = (user: UserResource) => {
    onSelect(user)
    onOpenChange(false)
    setSearchQuery("")
  }

  const handleClose = () => {
    setSearchQuery("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary via-primary/90 to-primary dark:from-primary dark:via-primary/80 dark:to-primary p-6 text-primary-foreground shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 shadow-lg border border-[#E2C992]/30">
                <User className="h-6 w-6 drop-shadow-[0_0_4px_rgba(226,201,146,0.6)]" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  اختر المستخدم
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80 mt-1">
                  اختر المستخدم المسند إليه المهمة
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="ابحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 transition-all duration-200 rounded-xl"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isUsersLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, idx) => (
                <Card key={idx} className="p-4 animate-pulse">
                  <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-3" />
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2" />
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                </Card>
              ))}
            </div>
          ) : users && users.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {users.map((user) => {
                const isSelected = selectedUserId === user.id
                return (
                  <Card
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105",
                      "border-2",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    )}
                  >
                    <div className="flex flex-col items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="h-16 w-16 ring-2 ring-gray-200 dark:ring-gray-700">
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={user.name} />
                          ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <div className="text-center">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {user.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.username}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <User className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? "لم يتم العثور على مستخدمين" : "لا توجد مستخدمين متاحين"}
              </p>
            </div>
          )}
        </div>

        {/* Selected User Info */}
        {selectedUser && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary">
                {selectedUser.avatar_url ? (
                  <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {selectedUser.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser.username}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="h-9"
              >
                تأكيد
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
