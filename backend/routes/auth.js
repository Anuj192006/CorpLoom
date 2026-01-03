const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Admin creates a new Company & Admin Account
router.post('/register-company', async (req, res) => {
    const { name, email, password, companyName } = req.body;
    try {
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const companyCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: { name: companyName, companyCode: companyCode }
            });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'ADMIN',
                    companyId: company.id
                }
            });

            return { user, company };
        });

        const token = jwt.sign(
            { userId: result.user.id, role: result.user.role, companyId: result.company.id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, companyCode: result.company.companyCode, user: { name: result.user.name, email: result.user.email, role: result.user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Employee registers using companyCode
router.post('/register', async (req, res) => {
    const { name, email, password, companyCode } = req.body;
    try {
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const company = await prisma.company.findUnique({ where: { companyCode } });
        if (!company) return res.status(400).json({ error: 'Invalid company code' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'EMPLOYEE',
                companyId: company.id
            }
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role, companyId: company.id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user.id, role: user.role, companyId: user.companyId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, companyId: user.companyId } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
