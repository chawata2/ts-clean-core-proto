import { type User, type CreateUserPayload, createUser } from '../domains/user';
import { type Result, type BaseError, success, failure, combineFailure } from '../domains/errors';
import { type UserRepo } from './inMemoryUserRepo';

// email重複チェック
async function validateEmailUniqueness(email: string, repo: UserRepo): Promise<Result<void, BaseError>> {
	const existingUser = await repo.findByEmail(email);
	if (existingUser) {
		return failure(
			{
				code: 'EMAIL_ALREADY_EXISTS',
				message: 'このメールアドレスはすでに使用されています。',
				path: ['email']
			}
		)
	}
	return success(undefined);
}


export async function createUserUC(cmd: CreateUserPayload, repo: UserRepo): Promise<Result<User, BaseError>> {
	const emailUniquenessResult = await validateEmailUniqueness(cmd.email, repo);
	const createUserResult = createUser(cmd);

	if (!emailUniquenessResult.isSuccess || !createUserResult.isSuccess) {
		return combineFailure(emailUniquenessResult, createUserResult);
	}

	await repo.create(createUserResult.value);
	return createUserResult;
}
