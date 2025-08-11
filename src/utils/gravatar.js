async function generateSha256Hash(message) {
    // Encode the string as a Uint8Array (UTF-8)
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
  
    // Hash the message using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
    // Convert the ArrayBuffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  
    return hashHex;
}

export async function getGravatarUrl(email) {
    const emailHash = await generateSha256Hash(email);
    return `https://www.gravatar.com/avatar/${emailHash}`;
}