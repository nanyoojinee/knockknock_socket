import { db } from '../index.js';

const UserModel = {
    create: async ({ newUser }) => {
        const createNewUser = await db.User.create(newUser);
        return createNewUser;
    },
    findByEmail: async email => {
        const user = await db.User.findOne({
            where: {
                email: email,
                isDeleted: 0,
            },
        });

        return user;
    },
    findById: async userId => {
        const user = await db.User.findOne({
            where: {
                user_id: userId,
                isDeleted: 0,
            },
        });
        return user;
    },
    update: async ({ userId, updateData }) => {
        const updatedUser = await db.User.update(updateData, {
            where: {
                user_id: userId,
                is_deleted: 0,
            },
        });
        return updatedUser;
    },
    delete: async ({ userId }) => {
        const deleteUser = await db.User.update(
            {
                is_deleted: 1,
                deleted_at: new Date(),
            },
            {
                where: {
                    user_id: userId,
                    is_deleted: 0,
                },
            },
        );
        return deleteUser;
    },
};

export { UserModel };
