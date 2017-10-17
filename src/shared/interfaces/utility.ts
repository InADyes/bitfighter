export type Readonly<T> = {
    readonly [K in keyof T]: Readonly<T[K]>;
}
