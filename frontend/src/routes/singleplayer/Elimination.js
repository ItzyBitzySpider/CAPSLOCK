import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Elimination from '../../components/Elimination';

const URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(URL, { autoConnect: true });

export default function SElimination() {
	const [roomId, setId] = useState('');
	const [started, setStarted] = useState(false);

	// run once to create room
	useEffect(() => {
		socket.emit('room create', { type: 'single elim' }, (id) => {
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
				<Elimination socket={socket} roomId={roomId} />
				<div></div>
			</div>
		</>
	);
}
