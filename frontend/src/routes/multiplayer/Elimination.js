import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ElimWord from '../../components/ElimWord';

export default function MElimination() {
	const URL = 'https://capslock-backend.herokuapp.com/';
	const socket = io(URL, { autoConnect: true });
	const [points, setPoints] = useState(0);
	const [wordTyped, setWordTyped] = useState('');
	const [wordlist, setWordlist] = useState({
		1: 2,
		2: 2,
		3: 2,
		4: 2,
		5: 2,
		6: 2,
	});

	useEffect(() => {
		socket.emit('room create', { type: 'double elim' }, (id) => {
			console.log('Created room with ID: ' + id);
			console.log('Client socket ID is: ' + socket.id);
			localStorage.setItem('roomId', id);
		});
	}, [socket]);

	useEffect(() => {
		socket.on('game elim update', ({ user, word, newWord }) => {
			const answerCorrect = user === socket.id;
			if (answerCorrect) setPoints(points + word.length);
			let wl = wordlist;
			delete wl[word];
			wl[newWord] = answerCorrect ? 1 : 2;
			setWordlist(wl);
			console.log(
				answerCorrect ? 'Correct' : "Opponent claimed '" + word + "'"
			);
			console.log(wordlist);
			//TODO: Update UI using answerCorrect and with new wordlist
		});
	});

	const handleKeypress = (e) => {
		if ((e.key === 'Enter') | (e.key === ' ')) {
			setWordTyped('');
			console.log(wordTyped);
			socket.emit('game elim submit', {
				roomId: localStorage.getItem('roomId'),
				word: wordTyped,
			});
		}
	};

	return (
		<div className='main-content'>
			<div className='rounded w-4/5 h-1/2 grid grid-cols-5 grid-rows-4'>
				{Object.keys(wordlist).map((word, index) => {
					return <ElimWord key={index} word={word} correct={wordlist[word]} />;
				})}
			</div>
			<br />
			<br />
			<br />
			<div>
				<input
					placeholder='Type here'
					className='bg-slate-100 w-96 text-xl text-neutral-700 rounded px-3 p-2 focus:outline-none'
					value={wordTyped}
					onChange={(e) => {
						if (e.target.value === ' ') {
							setWordTyped('');
						} else {
							setWordTyped(e.target.value);
						}
					}}
					onKeyDown={handleKeypress}
				/>
			</div>
		</div>
	);
}
