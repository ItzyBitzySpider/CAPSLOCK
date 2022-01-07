import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Elimination from '../../components/Elimination';

const URL = 'http://35.240.217.27:3000/';
const socket = io(URL, { autoConnect: true });

export default function MElimination() {
	const [roomId, setId] = useState('');

	// run once to create room
	useEffect(() => {
		socket.emit('room create', { type: 'double elim' }, (id) => {
			console.log('Created room with ID: ' + id);
			setId(id);
			console.log('Client socket ID is: ' + socket.id);
		});
	}, []);

	return (
		<div className='main-content'>
			<div>
				<h1 className='text-3xl p-4'>
					Room Code: <code>{roomId}</code>
				</h1>
			</div>
			<Elimination socket={socket} roomId={roomId} />
		</div>
	);
}
