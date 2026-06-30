export function maskEmail(email?: string | null) {
  if (!email) {
    return "email oculto";
  }

  const [local = "", domain = ""] = email.split("@");

  if (!domain) {
    return maskIdentifier(email);
  }

  const [domainName = "", ...domainRest] = domain.split(".");
  const domainSuffix = domainRest.length > 0 ? `.${domainRest.join(".")}` : "";

  return `${local.slice(0, 2)}***@${domainName.slice(0, 1)}***${domainSuffix}`;
}

export function maskIdentifier(value?: string | null, visible = 6) {
  if (!value) {
    return "oculto";
  }

  if (value.length <= visible * 2) {
    return `${value.slice(0, Math.max(2, visible))}***`;
  }

  return `${value.slice(0, visible)}...${value.slice(-visible)}`;
}
