import { useEffect, useState } from 'react';
import AdWord from './AdWord';

export default function AttackDefense({ roomId, socket }) {
	const [wordTyped, setWordTyped] = useState('');
	const [userlives, setUserLives] = useState(3);
	const [opplives, setOppLives] = useState(3);
	const [userWords, setUserWords] = useState([]);
	const [oppWords, setOppWords] = useState([]);
	const [end, setEnd] = useState(false);

	useEffect(() => {
		socket.on('game ad update', (players) => {
			Object.keys(players).forEach((id) => {
				if (id === socket.id) {
					const { wordlist, lives } = players[id];
					setUserWords(wordlist);
					setUserLives(lives);
				} else {
					const { wordlist, lives } = players[id];
					setOppWords(wordlist);
					setOppLives(lives);
				}
			});
		});
	}, []);

	// game start signal listener
	useEffect(() => {
		socket.on('game ad start', () => {
			setEnd(false);
		});
	}, []);

	// game over listener
	useEffect(() => {
		socket.on('game end', () => {
			setEnd(true);
		});
	}, []);

	const handleKeypress = (e) => {
		if ((e.key === 'Enter') | (e.key === ' ')) {
			setWordTyped('');
			console.log(wordTyped);
			socket.emit('game ad submit', { roomId: roomId, word: wordTyped });
		}
	};

	// method to restart game
	const restart = () => {
		setEnd(false);
        setWordTyped('');
		socket.emit('game start', { roomId });
	};

	return (
		<>
			{end && (
				<div className='absolute h-screen w-screen text-center bg-opacity-70 bg-black text-opacity-100 text-white '>
					<h1 className='text-6xl mt-80 relative '>Game Over</h1>
					<br />
					{userlives > 0 ? (
						<h2 className='text-3xl font-semibold p-4'>Result: You Won</h2>
					) : (
						<h2 className='text-3xl font-semibold p-4'>Result: You Lost</h2>
					)}
					<br />
					<button onClick={restart} className='text-2xl hover:font-medium border hover:border-2 rounded py-1 px-3'>
						Play Again
					</button>
				</div>
			)}
			<div className='rounded w-4/5 h-2/3 grid grid-cols-2 py-4 '>
				<ul className='list border-r-2'>
					<h1 className='font-medium text-center text-2xl p-4 '>
						Your Lives: {userlives}
					</h1>
					{userWords.map((word) => (
						<AdWord word={word} />
					))}
				</ul>
				<ul>
					<h1 className='font-medium text-center text-2xl p-4 '>
						Opponent Lives: {opplives}
					</h1>
					{oppWords.map((word) => (
						<AdWord word={word} />
					))}
				</ul>
			</div>
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
