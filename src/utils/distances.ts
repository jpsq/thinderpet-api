export const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c;

    return distancia;
}

// Función auxiliar para convertir grados a radianes
export const toRadians = (grados: any) => {
    return grados * (Math.PI / 180);
}
