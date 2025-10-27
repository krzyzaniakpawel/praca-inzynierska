import { User, Deck } from '../models/index.js'
import validator from 'validator'
import bcrypt from 'bcrypt'

export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const errors = {};

        if (!username || username.length < 3 || username.length > 25 || !/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.errorUsername = 'Niepoprawna nazwa użytkownika.'
        }
        if (!email || !validator.isEmail(email)) {
            errors.errorEmail = 'Niepoprawny e-mail.'
        }
        if (!password || password.length < 8 || password.length > 72) {
            errors.errorPassword = 'Niepoprawne hasło.'
        }

        if (!errors.errorUsername) {
            const userExists = await User.findOne({ attributes: [ 'username' ], where: { 'username': username } })
            if (userExists) {
                errors.errorUsername = 'Taki login już jest w użyciu.'
            }
        }
        if (!errors.errorEmail) {
            const emailExists = await User.findOne({ attributes: [ 'email' ], where: { 'email': email } })
            if (emailExists) {
                errors.errorEmail = 'Taki e-mail już jest w użyciu.'
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        const t = await User.sequelize.transaction()
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({ 'username': username, 'email': email, 'password': hashedPassword}, { transaction: t })
            await User.update({ 'created_by': user.user_id }, { where: { 'user_id': user.user_id }, transaction: t })
            await t.commit()
        } catch (error) {
            await t.rollback()
        }

        res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie.' })
    } catch (error) {
        res.status(500).json({ error: 'Wystąpił błąd serwera.' })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['user_id', 'username', 'email', 'created_at', 'created_by', 'is_admin'] });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Wystąpił błąd serwera.' });
    }
}

export const getUserAndItsDecks = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: ['user_id', 'username', 'email', 'created_at', 'created_by'],
            include: [{ association: 'decks' }]
        });

        if (!user) {
            return res.status(404).json({ error: 'Użytkownik nie znaleziony.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Wystąpił błąd serwera. xdd' });
    }
}