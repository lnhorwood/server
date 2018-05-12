export class URL {

    static concat(base: string, toConcat: string): string {
        return `${URL.replaceTrailingForwardSlashes(base)}/${URL.replaceTrailingAndLeadingForwardSlashes(toConcat)}`;
    }

    static join(...parts: string[]): string {
        return `/${parts.map(URL.replaceTrailingAndLeadingForwardSlashes).join('/')}`;
    }

    private static replaceTrailingForwardSlashes(part: string): string {
        return part.replace(/\/+$/g, '');
    }

    private static replaceTrailingAndLeadingForwardSlashes(part: string): string {
        return part.replace(/^\/+|\/+$/g, '');
    }

}