import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

interface MockUser {
    id: number;
    name: string;
    email: string;
    password: string;
}

let users: MockUser[] = [
    { id: 1, name: 'Admin', email: 'admin@example.com', password: '123456' },
    { id: 2, name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
    { id: 3, name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
    { id: 4, name: 'Carol White', email: 'carol@example.com', password: 'password123' },
    { id: 5, name: 'David Brown', email: 'david@example.com', password: 'password123' },
    { id: 6, name: 'Eva Martinez', email: 'eva@example.com', password: 'password123' },
    { id: 7, name: 'Frank Wilson', email: 'frank@example.com', password: 'password123' },
    { id: 8, name: 'Grace Lee', email: 'grace@example.com', password: 'password123' },
    { id: 9, name: 'Henry Taylor', email: 'henry@example.com', password: 'password123' },
    { id: 10, name: 'Iris Anderson', email: 'iris@example.com', password: 'password123' },
    { id: 11, name: 'Jack Thomas', email: 'jack@example.com', password: 'password123' },
    { id: 12, name: 'Karen Jackson', email: 'karen@example.com', password: 'password123' },
];
let nextId = 13;

function createMockJWT(payload: object): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const body = btoa(JSON.stringify(payload))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `${header}.${body}.mock_sig`;
}

function mockError(status: number, message: string, config: InternalAxiosRequestConfig): never {
    const mockResponse = {
        data: { message },
        status,
        statusText: status === 401 ? 'Unauthorized' : 'Bad Request',
        headers: {},
        config,
    };
    throw new axios.AxiosError(message, String(status), config, null, mockResponse);
}

function ok(data: unknown, config: InternalAxiosRequestConfig, headers: Record<string, string> = {}): AxiosResponse {
    return { data, status: 200, statusText: 'OK', headers, config };
}

function parseBody(config: InternalAxiosRequestConfig): Record<string, unknown> {
    if (!config.data) return {};
    if (typeof config.data === 'string') {
        try { return JSON.parse(config.data); } catch { return {}; }
    }
    return config.data as Record<string, unknown>;
}

function handleRequest(method: string, url: string, config: InternalAxiosRequestConfig): AxiosResponse {
    if (method === 'POST' && url === '/auth/login') {
        const { email, password } = parseBody(config);
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) mockError(401, 'Credenciais inválidas', config);
        const exp = Math.floor(Date.now() / 1000) + 3600;
        const token = createMockJWT({ id: user!.id, email: user!.email, exp });
        return ok({ token }, config);
    }

    if (method === 'POST' && url === '/users') {
        const { name, email, password } = parseBody(config);
        if (users.find(u => u.email === email)) mockError(400, 'E-mail já cadastrado', config);
        const newUser: MockUser = { id: nextId++, name: String(name), email: String(email), password: String(password) };
        users.push(newUser);
        const { password: _pw, ...safe } = newUser;
        return { data: safe, status: 201, statusText: 'Created', headers: {}, config };
    }

    if (method === 'GET' && url === '/users') {
        const params = config.params ?? {};
        const page = parseInt(params._page ?? '1', 10);
        const limit = parseInt(params._limit ?? '10', 10);
        const start = (page - 1) * limit;
        const slice = users.slice(start, start + limit).map(({ password: _pw, ...u }) => u);
        return ok(slice, config, { 'x-total-count': String(users.length) });
    }

    const userMatch = url.match(/^\/users\/(\d+)(\/password)?$/);
    if (userMatch) {
        const id = parseInt(userMatch[1], 10);
        const isPassword = !!userMatch[2];

        if (method === 'GET' && !isPassword) {
            const user = users.find(u => u.id === id);
            if (!user) mockError(404, 'Usuário não encontrado', config);
            const { password: _pw, ...safe } = user!;
            return ok(safe, config);
        }

        if (method === 'PUT' && !isPassword) {
            const { name, email } = parseBody(config);
            const idx = users.findIndex(u => u.id === id);
            if (idx === -1) mockError(404, 'Usuário não encontrado', config);
            users[idx] = { ...users[idx], name: String(name), email: String(email) };
            const { password: _pw, ...safe } = users[idx];
            return ok(safe, config);
        }

        if (method === 'DELETE' && !isPassword) {
            const idx = users.findIndex(u => u.id === id);
            if (idx === -1) mockError(404, 'Usuário não encontrado', config);
            users.splice(idx, 1);
            return ok({}, config);
        }

        if (method === 'PATCH' && isPassword) {
            const { currentPassword, newPassword } = parseBody(config);
            const idx = users.findIndex(u => u.id === id);
            if (idx === -1) mockError(404, 'Usuário não encontrado', config);
            if (users[idx].password !== currentPassword) mockError(400, 'Senha atual incorreta', config);
            users[idx] = { ...users[idx], password: String(newPassword) };
            return ok({ message: 'Senha alterada com sucesso' }, config);
        }
    }

    mockError(404, 'Not found', config);
    throw new Error('unreachable');
}

export function mockAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(handleRequest(config.method?.toUpperCase() ?? 'GET', config.url ?? '', config));
            } catch (e) {
                reject(e);
            }
        }, 250);
    });
}
