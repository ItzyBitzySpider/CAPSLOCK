import { useEffect, useState } from 'react';
import ElimWord from './ElimWord';

export default function Elimination({ roomId, socket }) {
	const [wordlist, setWordlist] = useState([]);
	const [wordTyped, setWordTyped] = useState('');
	const [userPoints, setUserPoints] = useState(0);
	const [oppPoints, setOppPoints] = useState(0);
	const [countdown, setCountdown] = useState('');
	const [time, setTime] = useState(0);
	const [end, setEnd] = useState(false);

	// game play listener
	useEffect(() => {
		socket.on('game elim update', ({ user, wordlist, newWord, scores }) => {
			const answerCorrect = user === socket.id;
			Object.keys(scores).forEach((id) => {
				if (id === socket.id) {
					setUserPoints(scores[id]);
				} else {
					setOppPoints(scores[id]);
				}
			});
			const ind = wordlist.findIndex((e) => e === newWord);
			let newWordlist = [];
			for (var i = 0; i < wordlist.length; i++) {
				let tmp = {};
				tmp['word'] = wordlist[i];
				tmp['state'] = 2;
				newWordlist[i] = tmp;
			}
			newWordlist[ind]['state'] = answerCorrect ? 1 : 0;
			setWordlist(newWordlist);
		});
	}, []);

	// game countdown to start listener
	useEffect(() => {
		socket.on('countdown', (count) => {
			setEnd(false);
			setCountdown(count);
			console.log(count);
			if (count === 'Start') setCountdown('');
		});
	}, []);

	// game start signal listener
	useEffect(() => {
		socket.on('game elim start', (startWordlist) => {
			console.log('started');
			setWordTyped('');
			setUserPoints(0);
			setOppPoints(0);
			setEnd(false);
			let arr = [];
			for (var i = 0; i < startWordlist.length; i++) {
				let tmp = {};
				tmp['word'] = startWordlist[i];
				tmp['state'] = 2;
				arr[i] = tmp;
			}
			setWordlist(arr);
		});
	}, []);

	// game timer listener
	useEffect(() => {
		socket.on('time', (time) => {
			setTime(time);
		});
	}, []);

	// opponent join room listener
	useEffect(() => {
		socket.on('room update', (mode) => {
			setEnd(false);
		});
	}, []);

	// game over listener
	useEffect(() => {
		socket.on('game end', () => {
			setEnd(true);
		});
	}, []);

	// method to send word over socket
	const handleKeypress = (e) => {
		if ((e.key === 'Enter') | (e.key === ' ')) {
			socket.emit('game elim submit', {
				roomId: roomId,
				word: wordTyped.toLowerCase(),
			});
			setWordTyped('');
		}
	};
	// callback to update word state in wordlist from new to old
	const callback = (i) => {
		let arr = wordlist;
		arr[i].state = 2;
		setWordlist(arr);
	};

	// method to restart game
	const restart = () => {
		setEnd(false);
		socket.emit('game start', { roomId });
	};

	return (
		<>
			{countdown !== '' && (
				<div className='absolute h-screen w-screen text-center bg-opacity-70 bg-black text-opacity-100 text-white '>
					<h1 className='text-6xl mt-80 relative '>Game Starting in</h1>
					<br />
					<h2 className='text-3xl font-semibold p-4'>{countdown}</h2>
					<br />
				</div>
			)}
			{end && (
				<div className='absolute h-screen w-screen text-center bg-opacity-70 bg-black text-opacity-100 text-white '>
					<h1 className='text-6xl mt-80 relative '>Game Over</h1>
					<br />
					{userPoints === oppPoints ? (
						<h2 className='text-3xl font-semibold p-4'>Result: Draw</h2>
					) : userPoints > oppPoints ? (
						<h2 className='text-3xl font-semibold p-4'>Result: You Won</h2>
					) : (
						<h2 className='text-3xl font-semibold p-4'>Result: You Lost</h2>
					)}
					<br />
					<button
						onClick={restart}
						className='text-2xl hover:font-medium border bg-teal-600 hover:bg-teal-500 hover:border-2 rounded py-1 px-3'>
						Play Again
					</button>
				</div>
			)}
			<div className='grid grid-cols-3 w-full text-lg sm:w-3/5 sm:text-2xl'>
				<h1 className='font-semibold text-center '>
					Score: <br /> {userPoints}
				</h1>
				<h1 className='text-center font-semibold '>
					Time Left: <br /> {time} s
				</h1>
				<h1 className='font-semibold text-center '>
					Opponent: <br /> {oppPoints}
				</h1>
			</div>

			<div className='rounded w-full sm:w-1/2 h-2/5 grid grid-cols-3 grid-rows-3'>
				{wordlist.map((obj, index) => {
					return (
						<ElimWord
							key={index}
							word={obj.word}
							correct={obj.state}
							callback={callback}
							index={index}
						/>
					);
				})}
			</div>
			<br />
			<div>
				<input
					placeholder='Type here'
					className='bg-slate-100 w-96 text-xl text-neutral-700 rounded px-3 p-2 focus:outline-none'
					value={wordTyped}
					onChange={(e) => {
						if (e.target.value !== ' ') setWordTyped(e.target.value);
					}}
					onKeyDown={handleKeypress}
				/>
			</div>
		</>
	);
}
