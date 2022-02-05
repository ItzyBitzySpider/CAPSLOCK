import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export default function AdWord({ word }) {
	return (
		<ul className='w-full text-center flex flex-row justify-center p-1'>
			<a className='p-0.5 w-1/2'>
				{word}
			</a>
			<CountdownCircleTimer
				isPlaying
				duration={5}
				colors={['#14b8a6','#f9bb15','#e11d48']}
				colorsTime={[5,2.5,0]}
				size={24}
				strokeWidth={5}
			/>
		</ul>
	);
}
