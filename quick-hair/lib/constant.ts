export interface BarberProfileProps {
    gmapLink: string
    id: string;
    lat: number;
    location: number;
    long: number;
    name: string;
    phoneNumber: number
    shopName: string
    user:
    {
        email: string,
        name: string, image: string
    }
    userId: string
}
