export interface BackendSettings {
    delayBetweenFights: number, // milliseconds
    minimumDonation: number,
    donationToHPRatio: number
    defaultState: {
        name: string,
        profileImageURL: string,
        chatMessage: string
    }
}
