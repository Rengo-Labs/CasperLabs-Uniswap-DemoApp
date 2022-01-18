import { CLAccountHash, CLKey, CLPublicKey } from 'casper-js-sdk';
export function createRecipientAddress(recipient) {
    if (recipient instanceof CLPublicKey) {
        return new CLKey(new CLAccountHash(recipient.toAccountHash()));
    } else {
        return new CLKey(recipient);
    }
};
