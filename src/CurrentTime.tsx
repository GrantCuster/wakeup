import { useState, useEffect } from "react";

export function CurrentTime() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <div className="text-9xl">{time.toLocaleTimeString().split(":").slice(0, 2).join(":")} {time.toLocaleTimeString().split(" ")[1]}</div>;
}

