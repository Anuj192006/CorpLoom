const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalEmployees = await prisma.user.count({
            where: { companyId: req.user.companyId }
        });

        const activeEmployees = await prisma.employee.count({
            where: {
                user: { companyId: req.user.companyId },
                status: 'ACTIVE'
            }
        });

        const inactiveEmployees = await prisma.employee.count({
            where: {
                user: { companyId: req.user.companyId },
                status: { not: 'ACTIVE' }
            }
        });

        const attendanceToday = await prisma.attendance.count({
            where: {
                companyId: req.user.companyId,
                date: { gte: today }
            }
        });

        const deptStats = await prisma.department.findMany({
            where: { companyId: req.user.companyId },
            include: { _count: { select: { employees: true } } }
        });

        res.json({
            totalEmployees,
            activeEmployees,
            inactiveEmployees,
            attendanceToday,
            deptStats: deptStats.map(d => ({ name: d.name, count: d._count.employees }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
