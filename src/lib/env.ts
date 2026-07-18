export function envFlag(name: string, defaultValue = false) {
  const value = process.env[name];
  if (value == null) return defaultValue;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}
