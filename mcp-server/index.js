import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

// Configuration du chemin vers tes marques
const REGISTRY_PATH = "/Users/alex/2a-audit/registry";

const server = new Server(
    { name: "2a-agency-notary", version: "1.0.0" },
    { capabilities: { resources: {} } }
);

// Liste tous tes fichiers JSON comme des ressources pour l'IA
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const files = await fs.readdir(REGISTRY_PATH, { recursive: true });
    return {
        resources: files
            .filter(f => f.endsWith('.json'))
            .map(f => ({
                uri: `notary://${f}`,
                name: `Certificat ${path.basename(f, '.json')}`,
                mimeType: "application/json"
            }))
    };
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Serveur 2A Agency Notary connecté !");