export interface Donation {
    id: number,
    name: string,
    amount: number,
    profileImageURL: string,
    // boss options are used if this fan becomes the bitboss
    bossMessage: string,
    bossEmoticonURL: string,
    bitBossCheerMote: boolean;
}
