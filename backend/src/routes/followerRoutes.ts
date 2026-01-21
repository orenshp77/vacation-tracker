import { Router } from 'express';
import { followVacation, unfollowVacation } from '../controllers/followerController';
import { verifyToken, verifyUser } from '../middlewares/authMiddleware';

const router = Router();

// POST /api/followers/:vacationId - Follow a vacation (users only)
router.post('/:vacationId', verifyToken, verifyUser, followVacation);

// DELETE /api/followers/:vacationId - Unfollow a vacation (users only)
router.delete('/:vacationId', verifyToken, verifyUser, unfollowVacation);

export default router;
