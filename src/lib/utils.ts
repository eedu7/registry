import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Convert file to byte array
export function fileToByteArray(file: File): Promise<number[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const byteArray = Array.from(new Uint8Array(arrayBuffer));
            resolve(byteArray);
        };

        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Convert byte array to base64 for display
export function byteArrayToBase64(byteArray: number[] | null | undefined): string | null {
    if (!byteArray || byteArray.length === 0) return null;

    const uint8Array = new Uint8Array(byteArray);

    let binary = "";

    uint8Array.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return `data:image/jpeg;base64,${btoa(binary)}`;
}

export function formatCnic(value: string | number): string | null {
    // Convert to string and remove all non-digits
    const digits = String(value).replace(/\D/g, "");

    // CNIC must be exactly 13 digits
    if (digits.length !== 13) return null;

    // Format: 5 digits - 7 digits - 1 digit
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}
