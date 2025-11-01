import { useCallback, useEffect, useRef } from "react";

export const useDebounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number
) => {
    const fnRef = useRef(fn);
    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clear = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const debounced = useCallback(
        (...args: Parameters<T>) => {
            clear();
            timerRef.current = setTimeout(() => {
                fnRef.current(...args);
            }, delay);
        },
        [delay, clear]
    );

    useEffect(() => clear, [clear]);

    return debounced;
};
