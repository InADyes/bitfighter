export interface Donation {
    readonly id: number,
    readonly name: string,
    readonly amount: number,
    readonly profileImageURL: string,
    readonly chatMessage: string,
    readonly emoticonURL: string
}
