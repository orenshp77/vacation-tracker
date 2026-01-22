import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel, { User } from '../models/UserModel';
import { isValidEmail, isValidPassword, sanitizeString } from '../utils/validators';

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const trimmedFirstName = sanitizeString(firstName);
        const trimmedLastName = sanitizeString(lastName);
        const trimmedEmail = sanitizeString(email).toLowerCase();

        if (!isValidEmail(trimmedEmail)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }

        if (!isValidPassword(password)) {
            res.status(400).json({ message: 'Password must be at least 4 characters' });
            return;
        }

        // Check if email exists
        const emailExists = await UserModel.emailExists(trimmedEmail);
        if (emailExists) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user
        const newUser: User = {
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            email: trimmedEmail,
            password: hashedPassword,
            role: 'user'
        };

        const userId = await UserModel.create(newUser);

        // Generate token
        const token = jwt.sign(
            { id: userId, email: trimmedEmail, role: 'user' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: userId,
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
                email: trimmedEmail,
                role: 'user'
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const trimmedEmail = sanitizeString(email).toLowerCase();

        if (!isValidEmail(trimmedEmail)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }

        if (!isValidPassword(password)) {
            res.status(400).json({ message: 'Password must be at least 4 characters' });
            return;
        }

        // Find user
        const user = await UserModel.findByEmail(trimmedEmail);
        if (!user) {
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        // Check password
        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) {
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
