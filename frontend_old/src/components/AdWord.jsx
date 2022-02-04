import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AdWord({ word }) {
	const ref = useRef();
	const red = '#e11d48';

	useEffect(() => {
		gsap.to(ref.current, {
			duration: 10,
			background: red,
			ease: 'none',
		});
	}, [word]);

	return (
		<ul className='w-full text-center flex flex-row justify-center p-1'>
            <p ref={ref} className=' bg-teal-500 p-0.5 rounded w-1/2'>
			{word}
            </p>
		</ul>
	);
}
