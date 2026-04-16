// In-memory storage (for demo - replace with Supabase in production)
let loans = [];

const DAILY_FINE_RATE = 1.00;

function calculateFine(dueDate, returnDate) {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);

    if (returned <= due) {
        return 0;
    }

    const daysOverdue = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
    return daysOverdue * DAILY_FINE_RATE;
}

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
        return res.status(200).json(loans);
    }

    if (req.method === 'POST') {
        const { userId, bookId, duration } = req.body;

        if (!userId || !bookId || !duration) {
            return res.status(400).json({ error: 'userId, bookId, and duration are required' });
        }

        const borrowDate = new Date();
        const dueDate = new Date(borrowDate.getTime() + duration * 24 * 60 * 60 * 1000);

        const newLoan = {
            id: Date.now().toString(),
            userId,
            bookId,
            borrowDate: borrowDate.toISOString(),
            dueDate: dueDate.toISOString(),
            returnDate: null,
            fine: 0,
        };

        loans.push(newLoan);
        return res.status(201).json(newLoan);
    }

    if (req.method === 'PUT') {
        const { id, returnDate } = req.query;

        const loan = loans.find(l => l.id === id);
        if (!loan) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        const fine = calculateFine(loan.dueDate, returnDate);
        loan.returnDate = returnDate;
        loan.fine = fine;

        return res.status(200).json(loan);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        loans = loans.filter(l => l.id !== id);
        return res.status(200).json({ message: 'Loan deleted' });
    }

    res.status(405).json({ error: 'Method not allowed' });
}
