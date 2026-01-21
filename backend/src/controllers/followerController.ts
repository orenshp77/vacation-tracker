import { Response } from 'express';
import FollowerModel from '../models/FollowerModel';
import VacationModel from '../models/VacationModel';
import { AuthRequest } from '../middlewares/authMiddleware';

export const followVacation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const vacationId = parseInt(req.params.vacationId);

        if (isNaN(vacationId)) {
            res.status(400).json({ message: 'Invalid vacation ID' });
            return;
        }

        // Check if vacation exists
        const vacation = await VacationModel.getById(vacationId);
        if (!vacation) {
            res.status(404).json({ message: 'Vacation not found' });
            return;
        }

        const result = await FollowerModel.follow(userId, vacationId);

        if (!result) {
            res.status(409).json({ message: 'Already following this vacation' });
            return;
        }

        res.status(200).json({ message: 'Successfully followed vacation' });
    } catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({ message: 'Server error while following vacation' });
    }
};

export const unfollowVacation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const vacationId = parseInt(req.params.vacationId);

        if (isNaN(vacationId)) {
            res.status(400).json({ message: 'Invalid vacation ID' });
            return;
        }

        const result = await FollowerModel.unfollow(userId, vacationId);

        if (!result) {
            res.status(404).json({ message: 'Not following this vacation' });
            return;
        }

        res.status(200).json({ message: 'Successfully unfollowed vacation' });
    } catch (error) {
        console.error('Unfollow error:', error);
        res.status(500).json({ message: 'Server error while unfollowing vacation' });
    }
};
