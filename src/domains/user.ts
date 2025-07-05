import { type Result, type BaseError, success, failure, combineFailure } from './errors';

const USER_NAME_MIN_LENGTH = 1;
const USER_NAME_MAX_LENGTH = 50;

export type User = {
	id: string;
	name: string;
	email: string;
	isActive: boolean;
}

/** ユーザー名の長さをチェック */
function validateUserNameLen(name: string): Result<string> {
	const errors: BaseError[] = [];
	if (name.length < USER_NAME_MIN_LENGTH) {
		errors.push({
			message: `ユーザー名は${USER_NAME_MIN_LENGTH}文字以上である必要があります。`,
			path: ['name']
		});
	}
	if (name.length > USER_NAME_MAX_LENGTH) {
		errors.push({
			message: `ユーザー名は${USER_NAME_MAX_LENGTH}文字以下である必要があります。`,
			path: ['name']
		});
	}
	return errors.length ? failure(...errors) : success(name);
}

/** メールの形式をチェック */
function validateEmailFormat(email: string): Result<string> {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return failure({
			message: 'メールアドレスの形式が正しくありません。',
			path: ['email']
		});
	}
	return success(email);
}


export type CreateUserPayload = {
	name: string;
	email: string;
}

/** ユーザーを作成する*/
export const createUser = (payload: CreateUserPayload): Result<User> => {
	const resultValidUserNameLen = validateUserNameLen(payload.name);
	const resultValidEmailFormat = validateEmailFormat(payload.email);

	if (!resultValidUserNameLen.isSuccess || !resultValidEmailFormat.isSuccess) {
		return combineFailure(resultValidUserNameLen, resultValidEmailFormat);
	}

	return success({
		id: crypto.randomUUID(),
		name: payload.name,
		email: payload.email,
		isActive: true
	})
}
