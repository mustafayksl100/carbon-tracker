// AES-GCM Encryption utilities for protecting personal data
// Uses Web Crypto API for secure encryption/decryption

const ENCRYPTION_KEY_NAME = 'carbontrack_encryption_key';

// Generate a random encryption key and store it in localStorage
async function getOrCreateEncryptionKey() {
    let keyData = localStorage.getItem(ENCRYPTION_KEY_NAME);

    if (!keyData) {
        // Generate a new random key
        const key = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true, // extractable
            ['encrypt', 'decrypt']
        );

        // Export and store the key
        const exportedKey = await crypto.subtle.exportKey('raw', key);
        keyData = Array.from(new Uint8Array(exportedKey))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        localStorage.setItem(ENCRYPTION_KEY_NAME, keyData);

        return key;
    }

    // Import existing key
    const keyBytes = new Uint8Array(keyData.match(/.{2}/g).map(byte => parseInt(byte, 16)));
    return await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

// Encrypt a string value
export async function encryptData(plainText) {
    if (!plainText || plainText === '') return '';

    try {
        const key = await getOrCreateEncryptionKey();
        const encoder = new TextEncoder();
        const data = encoder.encode(plainText);

        // Generate a random IV for each encryption
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        // Combine IV + encrypted data and encode as base64
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        return btoa(String.fromCharCode(...combined));
    } catch (error) {
        console.error('Encryption error:', error);
        return plainText; // Fallback to plain text on error
    }
}

// Check if a value looks like valid encrypted data (base64 with sufficient length)
function looksEncrypted(value) {
    if (!value || typeof value !== 'string') return false;
    // Encrypted data should be at least 28 chars (12 byte IV + some data, base64 encoded)
    if (value.length < 28) return false;
    // Check for valid base64 characters
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    if (!base64Regex.test(value)) return false;
    try {
        const decoded = atob(value);
        // Should have at least 13 bytes (12 IV + 1 data)
        return decoded.length >= 13;
    } catch {
        return false;
    }
}

// Decrypt an encrypted string
export async function decryptData(encryptedText) {
    if (!encryptedText || encryptedText === '') return '';

    // If it doesn't look like encrypted data, return as-is
    if (!looksEncrypted(encryptedText)) {
        return encryptedText;
    }

    try {
        const key = await getOrCreateEncryptionKey();

        // Decode from base64
        const combined = new Uint8Array(
            atob(encryptedText).split('').map(c => c.charCodeAt(0))
        );

        // Extract IV and encrypted data
        const iv = combined.slice(0, 12);
        const encrypted = combined.slice(12);

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            encrypted
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        // Silently return original value - likely unencrypted legacy data
        return encryptedText;
    }
}

// Encrypt an object's sensitive fields
export async function encryptUserData(userData) {
    const sensitiveFields = ['email', 'username', 'fullName', 'city', 'country'];
    const encrypted = { ...userData };

    for (const field of sensitiveFields) {
        if (encrypted[field]) {
            encrypted[field] = await encryptData(encrypted[field]);
        }
    }

    // Mark as encrypted
    encrypted._encrypted = true;
    return encrypted;
}

// Decrypt an object's sensitive fields
export async function decryptUserData(userData) {
    if (!userData || !userData._encrypted) return userData;

    const sensitiveFields = ['email', 'username', 'fullName', 'city', 'country'];
    const decrypted = { ...userData };

    for (const field of sensitiveFields) {
        if (decrypted[field]) {
            decrypted[field] = await decryptData(decrypted[field]);
        }
    }

    delete decrypted._encrypted;
    return decrypted;
}

// Check if a value looks encrypted (base64 pattern)
export function isEncrypted(value) {
    if (!value || typeof value !== 'string') return false;
    try {
        return btoa(atob(value)) === value && value.length > 20;
    } catch {
        return false;
    }
}
