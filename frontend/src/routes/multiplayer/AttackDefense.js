import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AttackDefense from '../../components/AttackDefense';


const URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(URL, { autoConnect: true });
console.log(URL)

export default function MAttackDefense() {
    const [roomId, setId] = useState('');

	// run once to create room
	useEffect(() => {
		socket.emit('room create', { type: 'double ad' }, (id) => {
			setId(id);
		});
	}, []);
    
	return (
		<div className='main-content'>
			<AttackDefense roomId={roomId} socket={socket} />
            <div>
				<h1 className='text-xl p-4'>
					Room Code: <code>{roomId}</code>
				</h1>
			</div>
		</div>
	);
}
