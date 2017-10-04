export interface Settings {
    delayBetweenFights: number, // milliseconds
    minimumDonation: number,
    donationToHPRatio: number
    defaultState: {
        name: string,
        profileImageURL: string,
        chatMessage: string
    }
}