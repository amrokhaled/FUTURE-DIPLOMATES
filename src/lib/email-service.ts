export async function sendConfirmationEmail(email: string, fullName: string, summitTitle: string) {
    console.log(`[MOCK EMAIL] Sending confirmation to ${email} for ${summitTitle}...`);

    // In a real implementation:
    // 1. Initialize Resend client
    // 2. Fetch React Email template
    // 3. send()

    return { success: true, messageId: "msg_" + Math.random().toString(36).substr(2, 9) };
}

export async function sendVisaReadyEmail(email: string, letterUrl: string) {
    console.log(`[MOCK EMAIL] Notifying ${email} that their visa letter is ready: ${letterUrl}`);
    return { success: true };
}
