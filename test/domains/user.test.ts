import { expect, test } from "bun:test";
import { createUser } from "../../src/domains/user";

test("ユーザー作成 - 正常系", () => {
  const result = createUser({
    name: "テストユーザー",
    email: "test@example.com",
  });

  expect(result.isSuccess).toBe(true);
  if (result.isSuccess) {
    expect(result.value.name).toBe("テストユーザー");
    expect(result.value.email).toBe("test@example.com");
    expect(result.value.isActive).toBe(true);
    expect(result.value.id).toBeDefined();
    expect(typeof result.value.id).toBe("string");
  }
});

test("ユーザー作成 - 名前が空文字", () => {
  const result = createUser({
    name: "",
    email: "test@example.com",
  });

  expect(result.isSuccess).toBe(false);
  if (!result.isSuccess) {
    expect(result.errors).toHaveLength(1);
    const [error] = result.errors;
    expect(error).toMatchObject({
      message: "ユーザー名は1文字以上である必要があります。",
      path: ["name"],
    });
  }
});

test("ユーザー作成 - 名前が長すぎる", () => {
  const longName = "a".repeat(51);
  const result = createUser({
    name: longName,
    email: "test@example.com",
  });

  expect(result.isSuccess).toBe(false);
  if (!result.isSuccess) {
    expect(result.errors).toHaveLength(1);
    const [error] = result.errors;
    expect(error).toMatchObject({
      message: "ユーザー名は50文字以下である必要があります。",
      path: ["name"],
    });
  }
});

test("ユーザー作成 - 不正なメールアドレス", () => {
  const result = createUser({
    name: "テストユーザー",
    email: "invalid-email",
  });

  expect(result.isSuccess).toBe(false);
  if (!result.isSuccess) {
    expect(result.errors).toHaveLength(1);
    const [error] = result.errors;
    expect(error).toMatchObject({
      message: "メールアドレスの形式が正しくありません。",
      path: ["email"],
    });
  }
});

test("ユーザー作成 - 複数のバリデーションエラー", () => {
  const result = createUser({
    name: "",
    email: "invalid-email",
  });

  expect(result.isSuccess).toBe(false);
  if (!result.isSuccess) {
    expect(result.errors).toHaveLength(2);
    const nameError = result.errors.find((e) => e.path.includes("name"));
    const emailError = result.errors.find((e) => e.path.includes("email"));
    expect(nameError).toMatchObject({
      message: "ユーザー名は1文字以上である必要があります。",
      path: ["name"],
    });
    expect(emailError).toMatchObject({
      message: "メールアドレスの形式が正しくありません。",
      path: ["email"],
    });
  }
});

test("ユーザー作成 - 境界値テスト（名前1文字）", () => {
  const result = createUser({
    name: "a",
    email: "test@example.com",
  });

  expect(result.isSuccess).toBe(true);
});

test("ユーザー作成 - 境界値テスト（名前50文字）", () => {
  const name50 = "a".repeat(50);
  const result = createUser({
    name: name50,
    email: "test@example.com",
  });

  expect(result.isSuccess).toBe(true);
});
