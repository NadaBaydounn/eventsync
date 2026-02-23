import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { eventFormSchema } from '@/lib/validators/event'
import { z } from 'zod'

// GET /api/events — List events (with search/filter)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    let queryBuilder = supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true })

    // Text search
    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`
      )
    }

    // Filters
    if (type) queryBuilder = queryBuilder.eq('event_type', type)
    if (status) queryBuilder = queryBuilder.eq('status', status)
    if (from) queryBuilder = queryBuilder.gte('start_time', from)
    if (to) queryBuilder = queryBuilder.lte('start_time', to)

    const { data, error } = await queryBuilder

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/events error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/events — Create event
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = eventFormSchema.parse(body)

    const { data, error } = await supabase
      .from('events')
      .insert({ ...validated, created_by: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('POST /api/events error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
