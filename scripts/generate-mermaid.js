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

    // Remove comments and split by lines
    const lines = schema
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//'));

    let currentModel = null;
    let currentEnum = null;

    for (const line of lines) {
        // Match model definition
        const modelMatch = line.match(/^model\s+(\w+)\s+\{/);
        if (modelMatch) {
            currentModel = modelMatch[1];
            models[currentModel] = { fields: [] };
            currentEnum = null;
            continue;
        }

        // Match enum definition
        const enumMatch = line.match(/^enum\s+(\w+)\s+\{/);
        if (enumMatch) {
            currentEnum = enumMatch[1];
            enums[currentEnum] = { values: [] };
            currentModel = null;
            continue;
        }

        // Match closing brace
        if (line === '}') {
            currentModel = null;
            currentEnum = null;
            continue;
        }

        // Process model fields
        if (currentModel) {
            // Ignore block attributes (@@)
            if (line.startsWith('@@')) continue;

            // Split by whitespace, simplifying parsing (ignoring complex attributes for now)
            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
                const name = parts[0];
                const type = parts[1];

                // Check if it's a relation field (basic heuristic: type is another model)
                // We'll verify later if 'type' is a known model to build relationships
                // But for storing fields, we just keep essential info

                let isArray = type.endsWith('[]');
                let isOptional = type.endsWith('?');
                let cleanType = type.replace('[]', '').replace('?', '');

                models[currentModel].fields.push({ name, type: cleanType, rawType: type, isArray, isOptional, attributes: line });
            }
        }

        // Process enum values
        if (currentEnum) {
            enums[currentEnum].values.push(line);
        }
    }

    // Generate Relationships
    // Iterate over all models and their fields to find relations
    Object.keys(models).forEach(modelName => {
        const model = models[modelName];
        model.fields.forEach(field => {
            // If field type is another model
            if (models[field.type]) {
                const relatedModelName = field.type;

                // Avoid duplicates: only process if modelName < relatedModelName OR it's self-relation
                // But here we might want to capture direction. 
                // In ER diagrams, usually we just show the link.
                // Prisma: 
                // User has posts Post[]
                // Post has author User
                // This is 1-n.

                // We need to find the inverse field to determine cardinality correctly
                const relatedModel = models[relatedModelName];
                const inverseField = relatedModel.fields.find(f => f.type === modelName);

                if (inverseField) {
                    // Determine cardinality
                    // If I have []. and they have scalar -> 1 to Many (They are the 1, I am the many? No.)
                    // User { posts Post[] } -> One User has Many posts.
                    // Post { user User } -> One Post has One User.
                    // Relation: User ||--o{ Post

                    // We only add relationship ONCE.
                    // Let's add it when we are on the "1" side (or the "principal" side if 1-1) usually clearer.
                    // Or just always add it from the current model perspective if we haven't added this pair yet.

                    // To avoid double printing A--B and B--A, we can store a key
                    const key = [modelName, relatedModelName].sort().join('-');

                    // However, for Mermaid, direction matters for the symbols:
                    // A ||--o{ B : "has"
                    // means A is 1, B is Many.

                    if (field.isArray && !inverseField.isArray) {
                        // 1-n: Current (Many) -> Related (One) ??
                        // Wait. field.isArray means "This model has MANY of related model".
                        // So THIS model is the ONE side?
                        // User { posts Post[] } -> User is 1, Post is N.
                        // output: User ||--o{ Post : "posts"
                        relationships.push(`${modelName} ||--o{ ${relatedModelName} : "${field.name}"`);
                    } else if (!field.isArray && inverseField.isArray) {
                        // related is 1, current is N. 
                        // We handled this when iterating the other model? 
                        // Yes, if we iterate all, we will hit the other case.
                        // But we want to avoid duplicates.
                        // Let's decided: Only emit if WE are the '1' side.
                        // If both are [], it's m-n.
                        // If neither are [], it's 1-1.
                    } else if (field.isArray && inverseField.isArray) {
                        // m-n. Explicit or implicit.
                        // Emit only if modelName < relatedModelName to avoid duplicate
                        if (modelName < relatedModelName) {
                            relationships.push(`${modelName} }|--|{ ${relatedModelName} : "${field.name}"`);
                        }
                    } else if (!field.isArray && !inverseField.isArray) {
                        // 1-1
                        // Emit if modelName < relatedModelName
                        if (modelName < relatedModelName) {
                            relationships.push(`${modelName} ||--|| ${relatedModelName} : "${field.name}"`);
                        }
                    }

                    // Wait, the logic above for 1-n:
                    // if field.isArray (I have many of them), then I am the 1 side?
                    // User: posts Post[]
                    // Post: author User
                    // User ||--o{ Post
                    // Yes. 
                }
            }
        });
    });

    // Output Construction
    let output = 'erDiagram\n';

    // Add Models
    Object.keys(models).forEach(name => {
        output += `  ${name} {\n`;
        models[name].fields.forEach(f => {
            // Only primitive types in the box usually, or all.
            // Mermaid supports type and name
            // We can skip relation fields in the body if we want, or keep them.
            // Usually cleaner to keep primitive types.
            if (!models[f.type]) { // if not a relation to another model
                output += `    ${f.type} ${f.name}\n`;
            }
        });
        output += `  }\n`;
    });

    // Add Enums? Mermaid ER doesn't support Enums natively as entities well, 
    // but we can add them as separate tables or comments. 
    // Often it's enough to just list them or Treat them as tables with nothing connected (or connected if used).
    // Let's output Enums as tables for completeness
    Object.keys(enums).forEach(name => {
        output += `  ${name} {\n`;
        enums[name].values.forEach(v => {
            output += `    value ${v}\n`;
        });
        output += `  }\n`;
    });

    // Add Relationships
    relationships.forEach(r => {
        output += `  ${r}\n`;
    });

    return output;
}

module.exports = { generateMermaid };
