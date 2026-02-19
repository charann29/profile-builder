import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const templatesJsonPath = path.resolve(process.cwd(), 'app/lib/templates.json');
const templatesDir = path.resolve(process.cwd(), 'app/templates');

async function migrate() {
    try {
        console.log('Reading templates.json...');
        const rawData = fs.readFileSync(templatesJsonPath, 'utf-8');
        const templates = JSON.parse(rawData);

        console.log(`Found ${templates.length} templates. Migrating...`);

        for (const tmpl of templates) {
            const htmlPath = path.join(templatesDir, tmpl.id, 'index.html');
            let htmlContent = '';

            if (fs.existsSync(htmlPath)) {
                htmlContent = fs.readFileSync(htmlPath, 'utf-8');
            } else {
                console.warn(`Warning: No HTML file found for template ${tmpl.id} at ${htmlPath}. Skipping HTML content.`);
                // If you want to skip entirely, continue; or store empty string.
                continue;
            }

            const record = {
                id: tmpl.id,
                name: tmpl.name,
                description: tmpl.description || '',
                thumbnail: tmpl.thumbnail || '',
                features: tmpl.features || [],
                category: tmpl.category || 'Simple',
                dimensions: tmpl.dimensions || { width: 794, height: 1123 },
                html: htmlContent,
            };

            const { error } = await supabase.from('templates').upsert(record, { onConflict: 'id' });

            if (error) {
                console.error(`Failed to migrate template ${tmpl.id}:`, error);
            } else {
                console.log(`Successfully migrated template: ${tmpl.id}`);
            }
        }

        console.log('Migration complete.');

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrate();
