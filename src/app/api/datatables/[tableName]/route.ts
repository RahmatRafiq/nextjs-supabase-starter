import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

interface DataTablesRequest {
  draw: number;
  start: number;
  length: number;
  search: string;
  searchFields: string[];
  order: Array<{ column: number; dir: string }>;
  columns: Array<{ data: string; searchable: boolean; orderable: boolean }>;
  filters?: Record<string, string>; // Custom filters (status, category, etc.)
}

interface DataTablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: unknown[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tableName: string } }
): Promise<NextResponse<DataTablesResponse | { error: string }>> {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Supabase server not configured' },
        { status: 500 }
      );
    }

    const supabase = supabaseServer;
    const { tableName } = params;
    const body: DataTablesRequest = await request.json();

    const {
      draw,
      start,
      length,
      search,
      searchFields,
      order,
      columns,
      filters = {},
    } = body;

    // Build base query
    let query = supabase.from(tableName).select('*', { count: 'exact' });

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        query = query.eq(key, value);
      }
    });

    // Apply search
    if (search && searchFields.length > 0) {
      // Build OR condition for search across multiple fields
      const searchConditions = searchFields.map((field) => {
        // Handle nested fields like 'author->>name'
        if (field.includes('->>')) {
          return `${field}.ilike.%${search}%`;
        }
        return `${field}.ilike.%${search}%`;
      }).join(',');
      
      query = query.or(searchConditions);
    }

    // Get total count (before pagination)
    const { count: recordsFiltered } = await query;

    // Apply sorting
    if (order && order.length > 0) {
      const sortColumn = columns[order[0].column];
      const sortDir = order[0].dir === 'asc';
      
      if (sortColumn && sortColumn.orderable) {
        query = query.order(sortColumn.data, { ascending: sortDir });
      }
    }

    // Apply pagination
    query = query.range(start, start + length - 1);

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('[DataTables API] Query error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Get total records (without search filter)
    const { count: recordsTotal } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    // Return DataTables response
    return NextResponse.json({
      draw,
      recordsTotal: recordsTotal ?? 0,
      recordsFiltered: recordsFiltered ?? 0,
      data: data ?? [],
    });
  } catch (error) {
    console.error('[DataTables API] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
