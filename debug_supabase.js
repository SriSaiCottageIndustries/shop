
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ytygnlarqqenpqomtrkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0eWdubGFycXFlbnBxb210cmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzI5NjQsImV4cCI6MjA4MTYwODk2NH0.9Xeqgqr376Os3Q9r-B5KM0bw8el1SLY579tx6BvAuwo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchProducts() {
    console.log("Fetching products...");
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
    } else {
        console.log('Products found:', data.length);
        if (data.length > 0) {
            console.log('First product:', data[0]);
        }
    }

    console.log("Fetching categories...");
    const { data: cats, error: catError } = await supabase.from('categories').select('*');
    if (catError) console.error(catError);
    else console.log('Categories found:', cats.length);
}

fetchProducts();
