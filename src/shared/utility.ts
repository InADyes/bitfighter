export function otherCharacter(char: number) {
    switch (char) {
        case 0:
            return 1;
        case 1:
            return 0;
        default:
            console.error('bad character');
            process.exit();
            return -1; // typescript does not recognise exit
    }
}
