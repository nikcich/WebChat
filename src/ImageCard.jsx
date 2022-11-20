import { useState, useEffect, useMemo, useRef } from 'react';

function useIsInViewport(ref) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const observer = useMemo(() =>
        new IntersectionObserver(([entry]) =>
            setIsIntersecting(entry.isIntersecting),
        ),
        [],
    );

    useEffect(() => {
        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref, observer]);

    return isIntersecting;
}

const ImageCard = (props) => {
    const ref1 = useRef(null);
    const refInView = useIsInViewport(ref1);
    const {img, index} = props;
    const [visited, setVisited] = useState(new Map());

    return (
        <>
            <div ref={ref1} className={`imgCard`}>
                <img src={img} 
                    style={{height: '100%', width: '100%', objectFit: 'cover'}}
                    className={`imageBox ${refInView?"inView":""}`}
                />
            </div>
        </>
    );
}

export default ImageCard;