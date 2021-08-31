import randomColor from "randomcolor";

export default class ColorHelper {
    /**
     * Generate a hex code for a random light color
     */
    static randomLightColor(): string {
        return randomColor({
            luminosity: 'light'
        })
    }
}