'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Event, EventFormData } from '@/types/events'
import { toast } from 'sonner'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } else {
      setEvents(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchEvents()

    // Real-time subscription
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents() // Refetch on any change
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchEvents])

  const createEvent = async (eventData: EventFormData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('You must be logged in')
      return null
    }

    const { data, error } = await supabase
      .from('events')
      .insert({ ...eventData, created_by: user.id })
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event')
      return null
    }

    toast.success(`${data.title} created! 🎉`)
    return data as Event
  }

  const updateEvent = async (id: string, updates: Partial<EventFormData>) => {
    const { data, error } = await supabase
      .from('events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating event:', error)
      toast.error('Failed to update event')
      return null
    }

    toast.success('Event updated!')
    return data as Event
  }

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
      return false
    }

    setEvents(prev => prev.filter(e => e.id !== id))
    toast.success('Event deleted')
    return true
  }

  const searchEvents = async (query: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Search error:', error)
      return []
    }
    return data as Event[]
  }

  // Derived data
  const upcomingEvents = events.filter(e => new Date(e.start_time) > new Date() && e.status !== 'cancelled')
  const pastEvents = events.filter(e => new Date(e.end_time) < new Date())
  const todayEvents = events.filter(e => {
    const start = new Date(e.start_time)
    const today = new Date()
    return start.toDateString() === today.toDateString()
  })

  return {
    events,
    loading,
    upcomingEvents,
    pastEvents,
    todayEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
    refetch: fetchEvents,
  }
}
