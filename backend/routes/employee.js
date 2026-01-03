const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all employees (Admin Only, Company-Wise)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const employees = await prisma.user.findMany({
            where: { companyId: req.user.companyId },
            include: {
                employee: {
                    include: { department: true, orgRole: true }
                }
            }
        });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update/Initial Setup of Employee Profile (Admin Only)
// This can act as "Add employee info" to a user
router.post('/setup/:userId', authMiddleware, adminMiddleware, async (req, res) => {
    const { departmentId, orgRoleId, status, dateOfJoining } = req.body;
    const userId = parseInt(req.params.userId);

    try {
        // Verify user belongs to same company
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser || targetUser.companyId !== req.user.companyId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const employeeRecord = await prisma.employee.upsert({
            where: { userId: userId },
            update: {
                departmentId: parseInt(departmentId),
                orgRoleId: parseInt(orgRoleId),
                status: status,
                dateOfJoining: new Date(dateOfJoining)
            },
            create: {
                userId: userId,
                departmentId: parseInt(departmentId),
                orgRoleId: parseInt(orgRoleId),
                status: status,
                dateOfJoining: new Date(dateOfJoining)
            }
        });

        res.json(employeeRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Employee (Admin Only)
router.delete('/:userId', authMiddleware, adminMiddleware, async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser || targetUser.companyId !== req.user.companyId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.$transaction([
            prisma.attendance.deleteMany({ where: { userId } }),
            prisma.employee.deleteMany({ where: { userId } }),
            prisma.user.delete({ where: { id: userId } })
        ]);

        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get own profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const profile = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: {
                employee: {
                    include: { department: true, orgRole: true }
                },
                company: true
            }
        });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
