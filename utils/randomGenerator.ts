export function generateRandomId(): string {
  return `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
}

export function generateUsername(): string {
  return `qa_user_${generateRandomId()}`.slice(0, 20);
}

export function generateEmail(): string {
  return `qa.${generateRandomId()}@example.com`;
}
