import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AttackDefense from '../../components/AttackDefense';

const URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(URL, { autoConnect: true });
console.log(URL);

export default function SAttackDefense() {
	const [roomId, setId] = useState('');
	const [started, setStarted] = useState(false);

	// run once to create room and start game
	useEffect(() => {
		socket.emit('room create', { type: 'single ad' }, (id) => {
			setId(id);
		});
	}, []);

	// method to restart game
	const start = () => {
		setStarted(true);
		socket.emit('game start', { roomId });
	};

	return (
		<>
			{!started && (
				<div className='absolute h-screen w-screen text-center bg-opacity-70 bg-black text-opacity-100 text-white '>
					<h1 className='text-6xl mt-80 relative '>Are you ready?</h1>
					<br />
					<br />
					<br />
					<button
						onClick={start}
						className='text-2xl hover:font-medium border bg-teal-600 hover:bg-teal-500 hover:border-2 rounded py-1 px-8'>
						Start
					</button>
				</div>
			)}
			<div className='main-content'>
				<AttackDefense roomId={roomId} socket={socket} />
				<div></div>
			</div>
		</>
	);
}
