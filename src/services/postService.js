import { PostModel } from '../db/models/postModel.js';
import { UserModel } from '../db/models/UserModel.js';
import { db } from '../db/index.js';
import { InternalServerError, NotFoundError, UnauthorizedError } from '../middlewares/errorMiddleware.js';

const postService = {
    createPost: async function ({ userId, post }) {
        let transaction;
        try {
            transaction = await db.sequelize.transaction();

            const user = await UserModel.findById(userId);

            if (!user) {
                throw new UnauthorizedError('잘못된 토큰입니다.');
            }

            await PostModel.create({ newPost: { userId, ...post } });

            await transaction.commit();

            return { message: '게시물 작성을 성공했습니다.' };
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }

            if (error instanceof UnauthorizedError) {
                throw error;
            } else {
                throw new InternalServerError('게시물 작성을 실패했습니다.');
            }
        }
    },
    getAllPosts: async function ({ page, perPage }) {
        try {
            const offset = (page - 1) * perPage;
            const limit = perPage;

            const { total, posts } = await PostModel.getAllPosts({ offset, limit });
            console.log(total);

            return { message: '게시글 전체 조회를 성공했습니다.', total, posts };
        } catch (error) {
            if (error) {
                throw new InternalServerError('게시물 전체 조회를 실패했습니다.');
            }
        }
    },
};

export { postService };
