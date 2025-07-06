type Success<T> = {
  readonly isSuccess: true;
  readonly value: T;
};

/** 全てのエラーが共通して持つ構造 */
export type BaseError = {
  readonly path: (string | number)[];
  readonly message: string;
};

type Failure<E extends BaseError> = {
  readonly isSuccess: false;
  readonly errors: E[];
};

export type Result<T, E extends BaseError = BaseError> =
  | Success<T>
  | Failure<E>;

export const success = <T>(value: T): Success<T> => {
  return {
    isSuccess: true,
    value,
  };
};

export const failure = <E extends BaseError>(...errors: E[]): Failure<E> => {
  return {
    isSuccess: false,
    errors,
  };
};

export const combineFailure = <E extends BaseError>(
  ...result: Result<unknown, E>[]
): Failure<E> => {
  const errors: E[] = [];
  for (const r of result) {
    if (!r.isSuccess) {
      errors.push(...r.errors);
    }
  }
  return failure(...errors);
};
