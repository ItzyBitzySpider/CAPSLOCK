import { useEffect, useState } from 'react';
import ElimWord from './ElimWord';

export default function Elimination({ roomId, socket }) {
	const [wordlist, setWordlist] = useState([]);
	const [wordTyped, setWordTyped] = useState('');
	const [points, setPoints] = useState(0);
	const [countdown, setCountdown] = useState(0);

	useEffect(() => {
		// game play
		socket.on('game elim update', ({ user, word, newWord }) => {
			const answerCorrect = user === socket.id;
			if (answerCorrect) setPoints(points + word.length);
			const ind = wordlist.findIndex((e) => e.word === word);
			let newWordlist = wordlist;
			newWordlist[ind] = { word: newWord, state: answerCorrect ? 1 : 2 };
			setWordlist(newWordlist);
			console.log(
				answerCorrect ? 'Correct' : "Opponent claimed '" + word + "'"
			);
		});

		// game has started
		socket.on('game elim start', (startWordlist) => {
			console.log(startWordlist);
			let arr = [];
			for (var i = 0; i < startWordlist.length; i++) {
				let tmp = {};
				tmp['word'] = startWordlist[i];
				tmp['state'] = 2;
				arr[i] = tmp;
			}
			setWordlist(arr);
		});

		socket.on('time', (time) => {
			setCountdown(time);
		});

		socket.on('room update', (mode) => {
			console.log(mode);
		});
	}, [socket, wordlist, points, countdown]);

	const handleKeypress = (e) => {
		if ((e.key === 'Enter') | (e.key === ' ')) {
			setWordTyped('');
			console.log(wordTyped);
			socket.emit('game elim submit', { roomId: roomId, word: wordTyped });
		}
	};

    const callback = (i) =>{
        let arr = wordlist;
        arr[i].state=2;
        setWordlist(arr);
    };

	return (
		<>
			<div className='grid grid-cols-2 w-3/5 text-xl'>
				<h1 className='font-medium underline'>Points: {points}</h1>
				<h1 className='text-right font-medium underline'>Time Left: {countdown}</h1>
			</div>
			<div className='rounded w-4/5 h-1/2 grid grid-cols-5 grid-rows-4'>
				{wordlist.map((obj, index) => {
					return <ElimWord key={index} word={obj.word} correct={obj.state} callback={callback} index={index} />;
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
		</>
	);
}
