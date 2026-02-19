import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const TEMPLATES_DIR = path.join(process.cwd(), 'app/templates');

export function compileTemplate(html: string, data: any): string {
    const template = Handlebars.compile(html);
    return template(data);
}

export async function getTemplate(id: string): Promise<string | null> {
    const templatePath = path.join(TEMPLATES_DIR, id, 'index.html');
    try {
        const html = await fs.promises.readFile(templatePath, 'utf-8');
        return html;
    } catch (error) {
        console.error(`Error reading template ${id}:`, error);
        return null;
    }
}

export async function getTemplateList(): Promise<string[]> {
    try {
        const items = await fs.promises.readdir(TEMPLATES_DIR, { withFileTypes: true });
        return items
            .filter(item => item.isDirectory())
            .map(item => item.name);
    } catch (error) {
        console.error('Error listing templates:', error);
        return [];
    }
}
