const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://okbtzexjuhgcawqvftkl.supabase.co';
const supabaseKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYnR6ZXhqdWhnY2F3cXZmdGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjcyNDMsImV4cCI6MjA5NjAwMzI0M30.sjpHEmU_9kHJidkixx81KRvCcNu8ogQsmfflfucL3F0';


const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

module.exports = { supabase };

