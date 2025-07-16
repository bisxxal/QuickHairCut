import  axios from 'axios';
export const getNearByShopsByApi = async (lat: number, long: number ) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/queue?lat=20.7672161&long=86.4514638&km=5`, {params: {lat,   long}})

        if (!response.data) {
            throw new Error('No data found');
        }
        const data = response.data;
        console.log(data)
        return data;
    } catch (error) {
        
    }
}
export const userJoinQueueByApi = async (barberId: string, userId: string) => {
    try {
        const response = await axios.post('http://localhost:8000/api/join', {
            barberId,
            userId
        });

        if (response.status !== 200) {
            throw new Error('Failed to join queue');
        }
        return response.data;
    } catch (error) {
        console.error("Error joining queue:", error);
        throw error;
    }
}