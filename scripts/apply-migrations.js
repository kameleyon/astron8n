// Script to apply migrations to the Supabase database
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Get migration files
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const migrationFiles = [
  '20250225_add_update_birth_chart_profile_function.sql',
  '20250225_add_execute_sql_function.sql',
  '20250228_add_performance_indexes.sql'
];

async function applyMigrations() {
  console.log('Applying migrations...');

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`Migration file not found: ${file}`);
        continue;
      }

      // Read SQL content
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`Applying migration: ${file}`);
      
      // Execute SQL
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`Error applying migration ${file}:`, error);
      } else {
        console.log(`Successfully applied migration: ${file}`);
      }
    } catch (err) {
      console.error(`Error processing migration ${file}:`, err);
    }
  }

  console.log('Migration process completed.');
}

// Run migrations
applyMigrations().catch(err => {
  console.error('Migration process failed:', err);
  process.exit(1);
});
