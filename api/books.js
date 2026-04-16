// In-memory storage (for demo - replace with Supabase in production)
let books = [
    { id: '1', title: 'The Hunger Games', author: 'Suzanne Collins', copies: 3 },
    { id: '2', title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', copies: 5 },
    { id: '3', title: 'Twilight', author: 'Stephenie Meyer', copies: 2 },
    { id: '4', title: 'To Kill a Mockingbird', author: 'Harper Lee', copies: 1 },
    { id: '5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', copies: 2 },
];

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
        return res.status(200).json(books);
    }

    if (req.method === 'POST') {
        const { title, author, copies } = req.body;

        if (!title || !author) {
            return res.status(400).json({ error: 'Title and author are required' });
        }

        const newBook = {
            id: Date.now().toString(),
            title,
            author,
            copies: copies || 1,
        };

        books.push(newBook);
        return res.status(201).json(newBook);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        books = books.filter(b => b.id !== id);
        return res.status(200).json({ message: 'Book deleted' });
    }

    res.status(405).json({ error: 'Method not allowed' });
}
