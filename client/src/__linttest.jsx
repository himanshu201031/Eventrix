import { useState, useEffect, useCallback } from 'react';

// Pattern C: useCallback + setTimeout defer in effect
export const C = () => {
    const [x, setX] = useState(0);
    const fetchX = useCallback(async () => {
        const data = await Promise.resolve(5);
        setX(data);
    }, []);
    useEffect(() => {
        const t = setTimeout(fetchX, 0);
        return () => clearTimeout(t);
    }, [fetchX]);
    return <div>{x}</div>;
};

// Pattern D: local async wrapper calling useCallback
export const D = () => {
    const [x, setX] = useState(0);
    const fetchX = useCallback(async () => {
        const data = await Promise.resolve(5);
        setX(data);
    }, []);
    useEffect(() => {
        const load = async () => { await fetchX(); };
        load();
    }, [fetchX]);
    return <div>{x}</div>;
};

// Pattern E: .then chain
export const E = () => {
    const [x, setX] = useState(0);
    const fetchX = useCallback(async () => {
        const data = await Promise.resolve(5);
        setX(data);
    }, []);
    useEffect(() => {
        void Promise.resolve().then(fetchX);
    }, [fetchX]);
    return <div>{x}</div>;
};
