import { Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import VacationModel from '../models/VacationModel';
import { AuthRequest } from '../middlewares/authMiddleware';
import { isValidPrice, isValidDateRange, isFutureDate, sanitizeString } from '../utils/validators';
import { uploadImage, deleteImage } from '../utils/fileUpload';

export const getAllVacations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const isAdmin = req.user!.role === 'admin';

        const vacations = await VacationModel.getAll(userId, isAdmin);

        res.status(200).json(vacations);
    } catch (error) {
        console.error('Get vacations error:', error);
        res.status(500).json({ message: 'Server error while fetching vacations' });
    }
};

export const getVacationById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid vacation ID' });
            return;
        }

        const vacation = await VacationModel.getById(id);

        if (!vacation) {
            res.status(404).json({ message: 'Vacation not found' });
            return;
        }

        res.status(200).json(vacation);
    } catch (error) {
        console.error('Get vacation error:', error);
        res.status(500).json({ message: 'Server error while fetching vacation' });
    }
};

export const createVacation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { destination, description, startDate, endDate, price } = req.body;

        // Validation
        if (!destination || !description || !startDate || !endDate || price === undefined) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const numPrice = parseFloat(price);
        if (!isValidPrice(numPrice)) {
            res.status(400).json({ message: 'Price must be between 0 and 10,000' });
            return;
        }

        if (!isValidDateRange(startDate, endDate)) {
            res.status(400).json({ message: 'End date must be after or equal to start date' });
            return;
        }

        if (!isFutureDate(startDate)) {
            res.status(400).json({ message: 'Start date cannot be in the past' });
            return;
        }

        // Handle image upload
        if (!req.files || !req.files.image) {
            res.status(400).json({ message: 'Image is required' });
            return;
        }

        const image = req.files.image as UploadedFile;
        const imageName = await uploadImage(image);

        const vacationId = await VacationModel.create({
            destination: sanitizeString(destination),
            description: sanitizeString(description),
            startDate,
            endDate,
            price: numPrice,
            imageName
        });

        res.status(201).json({
            message: 'Vacation created successfully',
            id: vacationId
        });
    } catch (error: any) {
        console.error('Create vacation error:', error);
        res.status(500).json({ message: error.message || 'Server error while creating vacation' });
    }
};

export const updateVacation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid vacation ID' });
            return;
        }

        const existingVacation = await VacationModel.getById(id);
        if (!existingVacation) {
            res.status(404).json({ message: 'Vacation not found' });
            return;
        }

        const { destination, description, startDate, endDate, price } = req.body;

        // Validation
        if (price !== undefined) {
            const numPrice = parseFloat(price);
            if (!isValidPrice(numPrice)) {
                res.status(400).json({ message: 'Price must be between 0 and 10,000' });
                return;
            }
        }

        const finalStartDate = startDate || existingVacation.startDate;
        const finalEndDate = endDate || existingVacation.endDate;

        if (!isValidDateRange(finalStartDate, finalEndDate)) {
            res.status(400).json({ message: 'End date must be after or equal to start date' });
            return;
        }

        // Handle image update
        let imageName: string | undefined;
        if (req.files && req.files.image) {
            const image = req.files.image as UploadedFile;
            imageName = await uploadImage(image);

            // Delete old image
            if (existingVacation.imageName) {
                deleteImage(existingVacation.imageName);
            }
        }

        const updateData: any = {};
        if (destination) updateData.destination = sanitizeString(destination);
        if (description) updateData.description = sanitizeString(description);
        if (startDate) updateData.startDate = startDate;
        if (endDate) updateData.endDate = endDate;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (imageName) updateData.imageName = imageName;

        await VacationModel.update(id, updateData);

        res.status(200).json({ message: 'Vacation updated successfully' });
    } catch (error: any) {
        console.error('Update vacation error:', error);
        res.status(500).json({ message: error.message || 'Server error while updating vacation' });
    }
};

export const deleteVacation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid vacation ID' });
            return;
        }

        const vacation = await VacationModel.getById(id);
        if (!vacation) {
            res.status(404).json({ message: 'Vacation not found' });
            return;
        }

        // Delete image file
        if (vacation.imageName) {
            deleteImage(vacation.imageName);
        }

        await VacationModel.delete(id);

        res.status(200).json({ message: 'Vacation deleted successfully' });
    } catch (error) {
        console.error('Delete vacation error:', error);
        res.status(500).json({ message: 'Server error while deleting vacation' });
    }
};

export const getFollowersReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const report = await VacationModel.getFollowersReport();
        res.status(200).json(report);
    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ message: 'Server error while generating report' });
    }
};

export const downloadCSV = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const report = await VacationModel.getFollowersReport();

        let csv = 'Destination,Followers\n';
        report.forEach(item => {
            csv += `${item.destination},${item.followers}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=vacations_followers.csv');
        res.status(200).send(csv);
    } catch (error) {
        console.error('CSV download error:', error);
        res.status(500).json({ message: 'Server error while generating CSV' });
    }
};
