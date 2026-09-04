export default function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
        // eslint-disable-next-line sonarjs/pseudo-random
        const randomIndex = Math.floor(Math.random() * currentIndex);

        currentIndex--;

        // eslint-disable-next-line no-param-reassign
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}
