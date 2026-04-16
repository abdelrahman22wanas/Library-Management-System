// In-memory storage (for demo - replace with Supabase in production)
let users = [];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        return res.status(200).json(users);
    }

    if (req.method === 'POST') {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        return res.status(201).json(newUser);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        users = users.filter(u => u.id !== id);
        return res.status(200).json({ message: 'User deleted' });
    }

    res.status(405).json({ error: 'Method not allowed' });
}
