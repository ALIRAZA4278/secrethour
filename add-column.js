import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addColumn() {
  try {
    // Check if column already exists
    const { data: columns } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (columns && columns[0] && columns[0].instaworld_tracking !== undefined) {
      console.log('✓ Column instaworld_tracking already exists');
      return;
    }

    // Add column via SQL
    const { error } = await supabase.rpc('alter_table_add_column', {
      table_name: 'orders',
      column_name: 'instaworld_tracking',
      column_type: 'text'
    });

    if (error && error.code !== 'PGRST116') { // Ignore if function doesn't exist
      // Try direct method - create via query
      console.log('Attempting alternative method...');
      const { data, error: sqlError } = await supabase
        .from('_sql')
        .select('*', { head: true });

      console.log('Note: Add this column manually via Supabase Dashboard:');
      console.log('Table: orders');
      console.log('Column Name: instaworld_tracking');
      console.log('Type: text');
      console.log('Nullable: true');
    } else {
      console.log('✓ Column instaworld_tracking added successfully');
    }
  } catch (err) {
    console.error('Error:', err.message);
    console.log('\nManual Setup Required:');
    console.log('1. Go to Supabase Dashboard');
    console.log('2. Open "secrethour_db" → "orders" table');
    console.log('3. Click "Add column"');
    console.log('4. Name: instaworld_tracking');
    console.log('5. Type: text');
    console.log('6. Make it nullable');
    console.log('7. Save');
  }
}

addColumn();
