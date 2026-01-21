import { Router } from 'express';
import {
    getAllVacations,
    getVacationById,
    createVacation,
    updateVacation,
    deleteVacation,
    getFollowersReport,
    downloadCSV
} from '../controllers/vacationController';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/vacations - Get all vacations (requires auth)
router.get('/', verifyToken, getAllVacations);

// GET /api/vacations/report - Get followers report (admin only)
router.get('/report', verifyToken, verifyAdmin, getFollowersReport);

// GET /api/vacations/csv - Download CSV report (admin only)
router.get('/csv', verifyToken, verifyAdmin, downloadCSV);

// GET /api/vacations/:id - Get vacation by ID (requires auth)
router.get('/:id', verifyToken, getVacationById);

// POST /api/vacations - Create vacation (admin only)
router.post('/', verifyToken, verifyAdmin, createVacation);

// PUT /api/vacations/:id - Update vacation (admin only)
router.put('/:id', verifyToken, verifyAdmin, updateVacation);

// DELETE /api/vacations/:id - Delete vacation (admin only)
router.delete('/:id', verifyToken, verifyAdmin, deleteVacation);

export default router;
