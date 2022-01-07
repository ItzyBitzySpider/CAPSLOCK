import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
export default function ElimWord({ word, correct = 2 }) {
	const ref = useRef();
	const right = 'green';
	const wrong = 'red';
	const flash = 'gray';
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
		} else {
			gsap.to(ref.current, {
				duration: 0.3,
				background: flash,
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
	}, [word]);

	return (
		<div className='rounded text-center text-lg flex flex-col items-center justify-center'>
			<p ref={ref} className='rounded py-3 w-64'>{word}</p>
		</div>
	);
}
