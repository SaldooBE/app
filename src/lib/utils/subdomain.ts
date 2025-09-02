/**
 * Extract subdomain from hostname
 * @param hostname - The full hostname (e.g., "demo.saldoo.be")
 * @param baseDomain - The base domain (e.g., "saldoo.be")
 * @returns The subdomain or null if not found
 */
export function extractSubdomain(hostname: string, baseDomain: string): string | null {
  if (!hostname || !baseDomain) return null
  
  // Remove base domain from hostname
  const subdomain = hostname.replace(`.${baseDomain}`, '').replace(baseDomain, '')
  
  // Return null if subdomain is empty or same as hostname (no subdomain)
  if (!subdomain || subdomain === hostname) return null
  
  return subdomain
}

/**
 * Check if hostname has a valid subdomain
 * @param hostname - The full hostname
 * @param baseDomain - The base domain
 * @returns boolean indicating if subdomain exists
 */
export function hasSubdomain(hostname: string, baseDomain: string): boolean {
  const subdomain = extractSubdomain(hostname, baseDomain)
  return subdomain !== null && subdomain.length > 0
}
