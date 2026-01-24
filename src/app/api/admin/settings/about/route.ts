import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/api/supabase-admin';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    // Create Supabase admin client
    const { client: supabaseAdmin, error: clientError } = createSupabaseAdmin();
    if (clientError || !supabaseAdmin) {
      return clientError ?? NextResponse.json({ error: 'Failed to create admin client' }, { status: 500 });
    }

    // Verify the user making the request
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin or super_admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !['admin', 'super_admin'].includes(profile?.role || '')) {
      return NextResponse.json(
        { error: 'Forbidden - admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate the structure
    if (!body.mission || !body.vision || !body.story) {
      return NextResponse.json(
        { error: 'Invalid about settings structure' },
        { status: 400 }
      );
    }

    // Upsert settings in database (INSERT if not exists, UPDATE if exists)
    const { error: upsertError } = await supabaseAdmin
      .from('site_settings')
      .upsert({
        key: 'about',
        content: body,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key'
      });

    if (upsertError) {
      console.error('Error upserting about settings:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save about settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'About settings updated successfully' });
  } catch (error) {
    console.error('Error updating about settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
