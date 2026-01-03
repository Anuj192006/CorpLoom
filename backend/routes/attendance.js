const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Check-in
router.post('/checkin', authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await prisma.attendance.findFirst({
            where: {
                userId: req.user.userId,
                date: { gte: today }
            }
        });

        if (existing) return res.status(400).json({ error: 'Already checked in today' });

        const attendance = await prisma.attendance.create({
            data: {
                userId: req.user.userId,
                companyId: req.user.companyId,
                date: new Date(),
                checkIn: new Date()
            }
        });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check-out
router.post('/checkout', authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const record = await prisma.attendance.findFirst({
            where: {
                userId: req.user.userId,
                date: { gte: today },
                checkOut: null
            }
        });

        if (!record) return res.status(400).json({ error: 'No active check-in found for today' });

        const updated = await prisma.attendance.update({
            where: { id: record.id },
            data: { checkOut: new Date() }
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View own attendance
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const records = await prisma.attendance.findMany({
            where: { userId: req.user.userId },
            orderBy: { date: 'desc' },
            take: 30
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View company attendance (Admin Only)
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const records = await prisma.attendance.findMany({
            where: { companyId: req.user.companyId },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { date: 'desc' },
            take: 100
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
