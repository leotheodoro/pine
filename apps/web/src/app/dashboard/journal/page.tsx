'use client'

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { Edit2, Loader2, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createJournalEntry } from '@/http/journal/create-journal-entry'
import { deleteJournalEntry } from '@/http/journal/delete-journal-entry'
import { type JournalEntryItem, listJournalEntries } from '@/http/journal/list-journal-entries'
import { updateJournalEntry } from '@/http/journal/update-journal-entry'

const PAGE_SIZE = 20

function todayString() {
  return format(new Date(), 'yyyy-MM-dd')
}

function groupEntriesByDay(entries: JournalEntryItem[]): Map<string, JournalEntryItem[]> {
  const map = new Map<string, JournalEntryItem[]>()
  for (const entry of entries) {
    const list = map.get(entry.date) ?? []
    list.push(entry)
    map.set(entry.date, list)
  }
  return map
}

function formatDayHeader(dateStr: string): string {
  const d = parseISO(dateStr)
  const today = todayString()
  if (dateStr === today) return 'Today'
  const yesterday = format(new Date(Date.now() - 864e5), 'yyyy-MM-dd')
  if (dateStr === yesterday) return 'Yesterday'
  return format(d, 'EEE, MMM d, yyyy')
}

export default function JournalPage() {
  const queryClient = useQueryClient()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [quickAddValue, setQuickAddValue] = useState('')
  const [editingEntry, setEditingEntry] = useState<JournalEntryItem | null>(null)
  const [editContent, setEditContent] = useState('')
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<JournalEntryItem | null>(null)

  const {
    data: listData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isListLoading,
  } = useInfiniteQuery({
    queryKey: ['journal', 'entries'],
    queryFn: ({ pageParam }) => listJournalEntries(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 0,
  })

  const allEntries = listData?.pages.flatMap((p) => p.entries) ?? []
  const entriesByDay = groupEntriesByDay(allEntries)
  const sortedDays = Array.from(entriesByDay.keys()).sort((a, b) => b.localeCompare(a))

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) return
    const el = sentinelRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage()
      },
      { rootMargin: '200px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const createMutation = useMutation({
    mutationFn: ({ date, content }: { date: string; content: string }) => createJournalEntry(date, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', 'entries'] })
      setQuickAddValue('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => updateJournalEntry(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', 'entries'] })
      setEditingEntry(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', 'entries'] })
      setDeleteConfirmEntry(null)
    },
  })

  const handleQuickAdd = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = quickAddValue.trim()
      if (!trimmed) return
      createMutation.mutate({ date: todayString(), content: trimmed })
    },
    [quickAddValue, createMutation]
  )

  const handleEdit = useCallback((entry: JournalEntryItem) => {
    setEditingEntry(entry)
    setEditContent(entry.content)
  }, [])

  const handleUpdateSubmit = useCallback(() => {
    if (!editingEntry) return
    const trimmed = editContent.trim()
    if (!trimmed) return
    updateMutation.mutate({ id: editingEntry.id, content: trimmed })
  }, [editingEntry, editContent, updateMutation])

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteConfirmEntry) return
    deleteMutation.mutate(deleteConfirmEntry.id)
  }, [deleteConfirmEntry, deleteMutation])

  return (
    <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold">Journal</h1>
        <p className="text-muted-foreground text-sm">Track your daily achievements and progress.</p>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <form onSubmit={handleQuickAdd} className="flex gap-2">
          <Input
            type="text"
            placeholder="Type what you achieved today and press Enter..."
            value={quickAddValue}
            onChange={(e) => setQuickAddValue(e.target.value)}
            disabled={createMutation.isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={createMutation.isPending || !quickAddValue.trim()}>
            {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Add'}
          </Button>
        </form>

        {isListLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : sortedDays.length === 0 ? (
          <p className="text-muted-foreground text-sm">No journal entries yet. Add your first achievement above.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedDays.map((day) => (
              <div key={day} className="rounded-lg border bg-card">
                <div className="border-b px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {formatDayHeader(day)}
                </div>
                <ul className="divide-y divide-border">
                  {(entriesByDay.get(day) ?? []).map((entry) => (
                    <li key={entry.id} className="group flex items-center gap-2 px-3 py-2 hover:bg-muted/50">
                      <div className="flex-1 text-sm">{entry.content}</div>
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(entry)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmEntry(entry)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div ref={sentinelRef} className="h-2" aria-hidden />
            {isFetchingNextPage && (
              <div className="flex justify-center py-2">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent showClose={true}>
          {editingEntry && (
            <>
              <DialogHeader>
                <DialogTitle>Edit entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-content">Content</Label>
                  <textarea
                    id="edit-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <Button
                  onClick={handleUpdateSubmit}
                  disabled={updateMutation.isPending || !editContent.trim()}
                  className="w-full"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    'Update'
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmEntry} onOpenChange={(open) => !open && setDeleteConfirmEntry(null)}>
        <DialogContent showClose={true}>
          {deleteConfirmEntry && (
            <>
              <DialogHeader>
                <DialogTitle>Delete entry?</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this entry? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setDeleteConfirmEntry(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={deleteMutation.isPending}
                    className="flex-1"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
