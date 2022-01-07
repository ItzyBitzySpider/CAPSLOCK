import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function MElimination() {
	const URL = 'https://capslock-backend.herokuapp.com/';
	const socket = io(URL, { autoConnect: true });
	let roomId = null;

	const [wordTyped, setWordTyped] = useState('');

	useEffect(() => {
		socket.emit('room create', { type: 'double elim' }, (id) => {
			console.log('Created room with ID: ' + id);
			console.log('Client socket ID is: '+socket.id)
			roomId = id;
		});
	}, []);

	const handleKeypress = e => {
		if (e.key === 'Enter' | e.key === ' ') {
			console.log(wordTyped)
			setWordTyped('');
			socket.emit('game elim submit', { roomId: roomId, word: wordTyped });
		}
	};

	const fakeData = [
		'1',
		'2',
		'3',
		'4',
		'5',
		'1',
		'2',
		'3',
		'4',
		'5',
		'1',
		'2',
		'3',
		'4',
		'5',
		'1',
		'2',
		'3',
		'4',
		'5',
	];

	return (
		<div className='main-content'>
			<div className='rounded w-4/5 h-3/5 grid grid-cols-5 grid-rows-4'>
				{fakeData.map((val) => {
					return <div className='text-center text-lg'>{val}</div>;
				})}
			</div>
			<br />
			<br />
			<br />
			<div>
				<input
					placeholder='Type here'
					className='bg-slate-100 w-96 text-xl text-neutral-700 rounded px-3 p-2 focus:outline-none'
					onKeyPress={handleKeypress}
					value={wordTyped}
					onChange={(e)=>setWordTyped(e.target.value)}
				/>
			</div>
		</div>
	);
}
