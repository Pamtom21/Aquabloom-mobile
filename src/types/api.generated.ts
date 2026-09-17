// Este archivo es generado. No editar manualmente.
// Fuente: ./contracts/openapi.json

export interface paths {
    "/lakes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listar lagos */
        get: operations["listLakes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Lake: {
            commune?: string | null;
            description?: string | null;
            /** Format: uuid */
            id: string;
            latitude?: number | null;
            longitude?: number | null;
            name: string;
            region: string;
            status?: string | null;
        };
        LakeListResponse: {
            items: components["schemas"]["Lake"][];
            page: number;
            page_size: number;
            total: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listLakes: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                region?: string;
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Página de lagos */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LakeListResponse"];
                };
            };
            /** @description Sesión ausente o vencida */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Filtros inválidos */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
