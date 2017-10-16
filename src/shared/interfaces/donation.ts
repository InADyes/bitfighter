export interface Donation {
    readonly id: number,
    readonly name: string,  //todo: make readonly again
    readonly amount: number,
    readonly profileImageURL: string,
    // boss options are used if this fan becomes the bitboss
    readonly bossMessage: string,
    readonly bossEmoticonURL: string,
    readonly bitBossCheerMote: boolean;
}
