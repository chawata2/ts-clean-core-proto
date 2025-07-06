import { type User, type CreateUserPayload, createUser } from '../domains/user';
import { type Result, success, failure, combineFailure } from '../domains/errors';
import { type UserRepo } from './inMemoryUserRepo';

// email重複チェック
async function validateEmailUniqueness(email: string, repo: UserRepo): Promise<Result<void>> {
	const existingUser = await repo.findByEmail(email);
	if (existingUser) {
		return failure(
			{
				message: 'このメールアドレスはすでに使用されています。',
				path: ['email']
			}
		)
	}
	return success(undefined);
}


export async function createUserUC(cmd: CreateUserPayload, repo: UserRepo): Promise<Result<User>> {
	const emailUniquenessResult = await validateEmailUniqueness(cmd.email, repo);
	const createUserResult = createUser(cmd);

	if (!emailUniquenessResult.isSuccess || !createUserResult.isSuccess) {
		return combineFailure(emailUniquenessResult, createUserResult);
	}

	await repo.create(createUserResult.value);
	return createUserResult;
}
