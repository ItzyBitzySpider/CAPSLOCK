import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import ElimWord from '../../components/ElimWord';

export default function Join() {
	const location = useLocation();
	const URL = 'https://capslock-backend.herokuapp.com/';
	const socket = io(URL, { autoConnect: true });
	const { roomId, from } = location.state;
	const [mode, setMode] = useState('');
	const [points, setPoints] = useState(0);
	const [wordTyped, setWordTyped] = useState('');
	const [wordlist, setWordlist] = useState({});

	// run once to join room
	useEffect(() => {
		socket.emit('room join', {
			roomId: roomId,
		});
	}, [roomId, socket]);

	// receive game mode and start game
	socket.on('room update', (mode) => {
		setMode(mode);
		socket.emit('game start', { roomId });
	});

	// logging shit
	socket.onAny((event, ...args) => {
		console.log(event, args);
	});

	// game play
	socket.on('game elim update', ({ user, word, newWord }) => {
		const answerCorrect = user === socket.id;
		if (answerCorrect) setPoints(points + word.length);
		let wl = wordlist;
		delete wl[word];
		wl[newWord] = answerCorrect ? 1 : 2;
		setWordlist(wl);
		console.log(answerCorrect ? 'Correct' : "Opponent claimed '" + word + "'");
	});

	// game has started
	socket.on('game elim start', (startWordlist) => {
		console.log(startWordlist);
		let wl = {};
		startWordlist.forEach((element) => {
			wl[element] = 2;
		});
		setWordlist(wl);
	});


	const handleKeypress = (e) => {
		if ((e.key === 'Enter') | (e.key === ' ')) {
			setWordTyped('');
			console.log(wordTyped);
			socket.emit('game elim submit', {
				roomId: roomId,
				word: wordTyped,
			});
		}
	};

	if (mode === 'elim') {
		return (
			<>
				<div className='main-content'>
					<div>
						<h1 className='text-3xl p-4'>
							Room Code: <code>{roomId}</code>
						</h1>
					</div>
					<div className='rounded w-4/5 h-1/2 grid grid-cols-5 grid-rows-4'>
						{Object.keys(wordlist).map((word, index) => {
							return (
								<ElimWord key={index} word={word} correct={wordlist[word]} />
							);
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
			</>
		);
	} else {
		return (
			<div className='main-content'>
					<div>
						<h1 className='text-3xl p-4'>
							Room Code: <code>{roomId}</code>
						</h1>
					</div>
					<div className='rounded w-4/5 h-1/2 grid grid-cols-5 grid-rows-4'>
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
}
