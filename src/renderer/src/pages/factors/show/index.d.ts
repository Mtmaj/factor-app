export type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;
export type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P>;
}[keyof T];
export declare const downloadThisLink: (url: string, name?: string, linkProps?: Partial<Pick<HTMLAnchorElement, WritableKeys<HTMLAnchorElement>>>) => void;
export declare const downloadBlob: (blob: Blob, name?: string) => string;
export default function ShowFactorPage(): import("react/jsx-runtime").JSX.Element;
