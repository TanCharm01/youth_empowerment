const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log(generateMermaid(schema));
} catch (error) {
    console.error('Error reading schema:', error);
}

function generateMermaid(schema) {
    const models = {};
    const enums = {};
    const relationships = [];

    const lines = schema
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//'));

    let currentModel = null;
    let currentEnum = null;

    for (const line of lines) {
        const modelMatch = line.match(/^model\s+(\w+)\s+\{/);
        if (modelMatch) {
            currentModel = modelMatch[1];
            models[currentModel] = { fields: [] };
            currentEnum = null;
            continue;
        }

        const enumMatch = line.match(/^enum\s+(\w+)\s+\{/);
        if (enumMatch) {
            currentEnum = enumMatch[1];
            enums[currentEnum] = { values: [] };
            currentModel = null;
            continue;
        }

        if (line === '}') {
            currentModel = null;
            currentEnum = null;
            continue;
        }

        if (currentModel) {
            if (line.startsWith('@@')) continue;

            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
                const name = parts[0];
                const type = parts[1];



                let isArray = type.endsWith('[]');
                let isOptional = type.endsWith('?');
                let cleanType = type.replace('[]', '').replace('?', '');

                models[currentModel].fields.push({ name, type: cleanType, rawType: type, isArray, isOptional, attributes: line });
            }
        }

        if (currentEnum) {
            enums[currentEnum].values.push(line);
        }
    }


    Object.keys(models).forEach(modelName => {
        const model = models[modelName];
        model.fields.forEach(field => {
            // If field type is another model
            if (models[field.type]) {
                const relatedModelName = field.type;


                const relatedModel = models[relatedModelName];
                const inverseField = relatedModel.fields.find(f => f.type === modelName);

                if (inverseField) {
                    const key = [modelName, relatedModelName].sort().join('-');

                    if (field.isArray && !inverseField.isArray) {
                        relationships.push(`${modelName} ||--o{ ${relatedModelName} : "${field.name}"`);
                    } else if (!field.isArray && inverseField.isArray) {
                    } else if (field.isArray && inverseField.isArray) {
                        if (modelName < relatedModelName) {
                            relationships.push(`${modelName} }|--|{ ${relatedModelName} : "${field.name}"`);
                        }
                    } else if (!field.isArray && !inverseField.isArray) {
                        if (modelName < relatedModelName) {
                            relationships.push(`${modelName} ||--|| ${relatedModelName} : "${field.name}"`);
                        }
                    }

                }
            }
        });
    });
    let output = 'erDiagram\n';

    Object.keys(models).forEach(name => {
        output += `  ${name} {\n`;
        models[name].fields.forEach(f => {
            if (!models[f.type]) {
                output += `    ${f.type} ${f.name}\n`;
            }
        });
        output += `  }\n`;
    });

    Object.keys(enums).forEach(name => {
        output += `  ${name} {\n`;
        enums[name].values.forEach(v => {
            output += `    value ${v}\n`;
        });
        output += `  }\n`;
    });

    relationships.forEach(r => {
        output += `  ${r}\n`;
    });

    return output;
}

module.exports = { generateMermaid };
