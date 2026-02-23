import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name } = await req.json()

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Admin client with service role — bypasses ALL RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create auth user via admin API (bypasses trigger issues)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    })

    if (error) {
      console.error('Admin createUser error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Ensure profile exists (service role bypasses RLS)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: data.user.id,
          full_name,
          email,
        },
        { onConflict: 'id' }
      )

    if (profileError) {
      console.error('Profile upsert error:', profileError)
      // User was created, profile insert failed — not fatal
    }

    return NextResponse.json({ user: { id: data.user.id, email: data.user.email } })
  } catch (err) {
    console.error('Register API error:', err)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
