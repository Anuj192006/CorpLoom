const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Departments
router.get('/departments', authMiddleware, async (req, res) => {
    try {
        const depts = await prisma.department.findMany({ where: { companyId: req.user.companyId } });
        res.json(depts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/departments', authMiddleware, adminMiddleware, async (req, res) => {
    const { name } = req.body;
    try {
        const dept = await prisma.department.create({
            data: { name, companyId: req.user.companyId }
        });
        res.json(dept);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Roles
router.get('/roles', authMiddleware, async (req, res) => {
    try {
        const roles = await prisma.orgRole.findMany({ where: { companyId: req.user.companyId } });
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/roles', authMiddleware, adminMiddleware, async (req, res) => {
    const { name } = req.body;
    try {
        const role = await prisma.orgRole.create({
            data: { name, companyId: req.user.companyId }
        });
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
