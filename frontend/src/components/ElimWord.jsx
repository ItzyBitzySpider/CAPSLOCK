import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
export default function ElimWord({ word, correct, callback, index }) {
	const ref = useRef();
	const right = '#14b8a6';
	const wrong = '#f43f5e';
	const none = '#1e293b';

	useEffect(() => {
		if (correct === 1) {
			gsap.to(ref.current, {
				duration: 0.3,
				background: right,
				ease: 'none',
			});
			setTimeout(() => {
				gsap.to(ref.current, {
					duration: 0.3,
					background: none,
					ease: 'none',
				});
			}, 300);
		} else if (correct === 0) {
			gsap.to(ref.current, {
				duration: 0.3,
				background: wrong,
				ease: 'none',
			});
			setTimeout(() => {
				gsap.to(ref.current, {
					duration: 0.3,
					background: none,
					ease: 'none',
				});
			}, 300);
		} 
		callback(index);
	}, [ word ]);

	return (
		<div className='rounded text-center flex flex-col items-center  justify-center'>
			<p ref={ref} className='text-lg sm:text-xl rounded py-5 w-full'>{word}</p>
		</div>
	);
}
